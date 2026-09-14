-- Communication System Database Migration Script
-- Enables real-time messaging, RLS security, and role/class authorization.

DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversation_participants CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;

-- 1. Conversations table
CREATE TABLE conversations (
    id text PRIMARY KEY,
    college_id text NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    participant_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
    participant_names jsonb DEFAULT '[]'::jsonb,
    last_message text,
    last_message_at timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 2. Conversation participants table
CREATE TABLE conversation_participants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id text NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id text NOT NULL,
    role text NOT NULL,
    college_id text NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now()
);

-- 3. Messages table
CREATE TABLE messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id text NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    college_id text NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    sender_id text NOT NULL,
    receiver_id text NOT NULL,
    content text NOT NULL,
    sender_name text,
    sender_role text,
    read_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_conversations_college_id ON conversations(college_id);
CREATE INDEX idx_conversations_participant_ids ON conversations USING gin (participant_ids);
CREATE INDEX idx_conversation_participants_user ON conversation_participants(user_id);
CREATE INDEX idx_conversation_participants_conv ON conversation_participants(conversation_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_college_id ON messages(college_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_read_at ON messages(read_at);

-- Authorization Functions
CREATE OR REPLACE FUNCTION is_teacher_assigned_to_student(p_teacher_id text, p_student_id text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_t_college_id text;
    v_s_college_id text;
    v_t_assigned_classes jsonb;
    v_t_id text;
    v_t_teacher_id text;
    v_t_email text;
    v_s_class_id text;
    v_s_class_name text;
    v_s_course text;
    v_s_branch text;
    v_s_year text;
    v_s_section text;
    v_c_name text;
    v_constructed_name text;
BEGIN
    SELECT college_id, assigned_classes, id::text, teacher_id, email
    INTO v_t_college_id, v_t_assigned_classes, v_t_id, v_t_teacher_id, v_t_email
    FROM teachers
    WHERE profile_id::text = p_teacher_id OR id = p_teacher_id OR teacher_id = p_teacher_id
    LIMIT 1;

    IF v_t_college_id IS NULL THEN
        SELECT college_id INTO v_t_college_id FROM profiles WHERE id::text = p_teacher_id AND role = 'teacher';
    END IF;

    SELECT college_id, class_id, class_name, course, branch, year, section
    INTO v_s_college_id, v_s_class_id, v_s_class_name, v_s_course, v_s_branch, v_s_year, v_s_section
    FROM students
    WHERE profile_id::text = p_student_id OR id = p_student_id
    LIMIT 1;

    IF v_s_college_id IS NULL THEN
        SELECT college_id INTO v_s_college_id FROM profiles WHERE id::text = p_student_id AND role = 'student';
    END IF;

    IF v_t_college_id IS NULL OR v_s_college_id IS NULL THEN
        RETURN false;
    END IF;

    IF v_t_college_id <> v_s_college_id THEN
        RETURN false;
    END IF;

    IF v_s_class_id IS NOT NULL THEN
        SELECT name INTO v_c_name FROM classes WHERE id = v_s_class_id LIMIT 1;
    END IF;

    IF v_s_course IS NOT NULL AND v_s_branch IS NOT NULL AND v_s_year IS NOT NULL AND v_s_section IS NOT NULL THEN
        v_constructed_name := v_s_course || ' ' || v_s_branch || ' - ' || v_s_year || ' - ' || v_s_section;
    END IF;

    IF v_t_assigned_classes IS NOT NULL AND jsonb_typeof(v_t_assigned_classes) = 'array' THEN
        IF (v_c_name IS NOT NULL AND v_t_assigned_classes @> jsonb_build_array(v_c_name)) OR
           (v_s_class_id IS NOT NULL AND v_t_assigned_classes @> jsonb_build_array(v_s_class_id)) OR
           (v_s_class_name IS NOT NULL AND v_t_assigned_classes @> jsonb_build_array(v_s_class_name)) OR
           (v_constructed_name IS NOT NULL AND v_t_assigned_classes @> jsonb_build_array(v_constructed_name)) THEN
            RETURN true;
        END IF;
    END IF;

    IF v_s_class_id IS NOT NULL OR v_c_name IS NOT NULL OR v_s_class_name IS NOT NULL THEN
        IF EXISTS (
            SELECT 1 FROM classes
            WHERE (id = v_s_class_id OR name = v_c_name OR name = v_s_class_name OR name = v_constructed_name)
              AND (
                teacher_id = v_t_teacher_id OR
                teacher_id = v_t_email OR
                teacher_id = v_t_id OR
                teacher_id = p_teacher_id OR
                POSITION(v_t_email IN teacher_id) > 0 OR
                POSITION(p_teacher_id IN teacher_id) > 0
              )
        ) THEN
            RETURN true;
        END IF;
    END IF;

    IF v_s_class_id IS NOT NULL THEN
        IF EXISTS (
            SELECT 1 FROM timetable_entries
            WHERE class_id = v_s_class_id
              AND (
                teacher_id = v_t_teacher_id OR
                teacher_id = v_t_email OR
                teacher_id = v_t_id OR
                teacher_id = p_teacher_id
              )
        ) THEN
            RETURN true;
        END IF;
    END IF;

    RETURN false;
END;
$$;

CREATE OR REPLACE FUNCTION can_communicate(p_user_a text, p_user_b text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_role_a text;
    v_college_a text;
    v_role_b text;
    v_college_b text;
BEGIN
    IF p_user_a IS NULL OR p_user_b IS NULL THEN
        RETURN false;
    END IF;

    SELECT role, college_id INTO v_role_a, v_college_a FROM profiles WHERE id::text = p_user_a LIMIT 1;
    SELECT role, college_id INTO v_role_b, v_college_b FROM profiles WHERE id::text = p_user_b LIMIT 1;

    IF v_role_a IS NULL OR v_role_b IS NULL OR v_college_a IS NULL OR v_college_b IS NULL THEN
        RETURN false;
    END IF;

    IF v_college_a <> v_college_b THEN
        RETURN false;
    END IF;

    IF (v_role_a IN ('admin', 'school_admin', 'college_admin', 'super_admin') AND v_role_b = 'teacher') OR
       (v_role_a = 'teacher' AND v_role_b IN ('admin', 'school_admin', 'college_admin', 'super_admin')) THEN
        RETURN true;
    END IF;

    IF v_role_a = 'teacher' AND v_role_b = 'student' THEN
        RETURN is_teacher_assigned_to_student(p_user_a, p_user_b);
    END IF;

    IF v_role_a = 'student' AND v_role_b = 'teacher' THEN
        RETURN is_teacher_assigned_to_student(p_user_b, p_user_a);
    END IF;

    RETURN false;
END;
$$;

-- Search RPC Function
CREATE OR REPLACE FUNCTION search_communication_users(p_search_query text, p_user_id text DEFAULT NULL)
RETURNS TABLE (
    id text,
    name text,
    email text,
    role text,
    avatar_url text,
    sub_title text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_curr_id text;
    v_curr_role text;
    v_curr_college_id text;
    v_q text := TRIM(p_search_query);
BEGIN
    v_curr_id := COALESCE(p_user_id, auth.uid()::text);
    IF v_curr_id IS NULL OR v_q = '' THEN
        RETURN;
    END IF;

    SELECT p.role, p.college_id INTO v_curr_role, v_curr_college_id
    FROM profiles p WHERE p.id::text = v_curr_id LIMIT 1;

    IF v_curr_role IS NULL OR v_curr_college_id IS NULL THEN
        RETURN;
    END IF;

    IF v_curr_role IN ('admin', 'school_admin', 'college_admin', 'super_admin') THEN
        RETURN QUERY
        SELECT
            p.id::text,
            p.name,
            p.email,
            'Teacher'::text AS role,
            p.avatar_url,
            COALESCE(t.department, 'Teacher') AS sub_title
        FROM profiles p
        LEFT JOIN teachers t ON t.profile_id = p.id
        WHERE p.college_id = v_curr_college_id
          AND p.role = 'teacher'
          AND (
            p.name ILIKE '%' || v_q || '%' OR
            p.email ILIKE '%' || v_q || '%' OR
            (t.teacher_id IS NOT NULL AND t.teacher_id ILIKE '%' || v_q || '%')
          )
        ORDER BY p.name
        LIMIT 20;

    ELSIF v_curr_role = 'teacher' THEN
        RETURN QUERY
        SELECT
            p.id::text,
            p.name,
            p.email,
            'Admin'::text AS role,
            p.avatar_url,
            'College Admin'::text AS sub_title
        FROM profiles p
        WHERE p.college_id = v_curr_college_id
          AND p.role IN ('admin', 'school_admin', 'college_admin')
          AND (p.name ILIKE '%' || v_q || '%' OR p.email ILIKE '%' || v_q || '%')
        UNION ALL
        SELECT
            p.id::text,
            p.name,
            p.email,
            'Student'::text AS role,
            p.avatar_url,
            COALESCE('Roll: ' || s.roll_no || ' · ' || COALESCE(s.class_name, s.course, 'Student'), 'Student') AS sub_title
        FROM profiles p
        JOIN students s ON s.profile_id = p.id
        WHERE p.college_id = v_curr_college_id
          AND p.role = 'student'
          AND (
            p.name ILIKE '%' || v_q || '%' OR
            s.roll_no ILIKE '%' || v_q || '%' OR
            p.email ILIKE '%' || v_q || '%'
          )
          AND is_teacher_assigned_to_student(v_curr_id, p.id::text) = true
        ORDER BY name
        LIMIT 20;

    ELSIF v_curr_role = 'student' THEN
        RETURN QUERY
        SELECT
            p.id::text,
            p.name,
            p.email,
            'Teacher'::text AS role,
            p.avatar_url,
            COALESCE(t.department, 'Teacher') AS sub_title
        FROM profiles p
        LEFT JOIN teachers t ON t.profile_id = p.id
        WHERE p.college_id = v_curr_college_id
          AND p.role = 'teacher'
          AND (p.name ILIKE '%' || v_q || '%' OR p.email ILIKE '%' || v_q || '%')
          AND is_teacher_assigned_to_student(p.id::text, v_curr_id) = true
        ORDER BY p.name
        LIMIT 20;
    END IF;

    RETURN;
END;
$$;

-- Conversation Management RPCs
CREATE OR REPLACE FUNCTION get_or_create_conversation(p_target_user_id text, p_user_id text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_sender_id text;
    v_sender_profile record;
    v_target_profile record;
    v_conv_id text;
    v_existing_conv record;
    v_result jsonb;
BEGIN
    v_sender_id := COALESCE(p_user_id, auth.uid()::text);
    IF v_sender_id IS NULL OR p_target_user_id IS NULL THEN
        RAISE EXCEPTION 'Sender ID and target user ID are required';
    END IF;

    SELECT id, name, role, college_id, avatar_url INTO v_sender_profile FROM profiles WHERE id::text = v_sender_id LIMIT 1;
    SELECT id, name, role, college_id, avatar_url INTO v_target_profile FROM profiles WHERE id::text = p_target_user_id LIMIT 1;

    IF v_sender_profile.id IS NULL OR v_target_profile.id IS NULL THEN
        RAISE EXCEPTION 'User profile not found';
    END IF;

    IF v_sender_profile.college_id <> v_target_profile.college_id THEN
        RAISE EXCEPTION 'Users belong to different colleges';
    END IF;

    IF can_communicate(v_sender_id, p_target_user_id) = false THEN
        RAISE EXCEPTION 'Communication not permitted between these users';
    END IF;

    SELECT id, college_id, participant_ids, participant_names, last_message, last_message_at, created_at
    INTO v_existing_conv
    FROM conversations
    WHERE college_id = v_sender_profile.college_id
      AND participant_ids @> jsonb_build_array(v_sender_id)
      AND participant_ids @> jsonb_build_array(p_target_user_id)
    LIMIT 1;

    IF v_existing_conv.id IS NOT NULL THEN
        SELECT jsonb_build_object(
            'id', v_existing_conv.id,
            'college_id', v_existing_conv.college_id,
            'participant_ids', v_existing_conv.participant_ids,
            'participant_names', v_existing_conv.participant_names,
            'last_message', v_existing_conv.last_message,
            'last_message_at', v_existing_conv.last_message_at,
            'created_at', v_existing_conv.created_at,
            'target_name', v_target_profile.name,
            'target_role', v_target_profile.role,
            'target_avatar', v_target_profile.avatar_url,
            'is_new', false
        ) INTO v_result;
        RETURN v_result;
    END IF;

    v_conv_id := 'conv_' || replace(gen_random_uuid()::text, '-', '');

    INSERT INTO conversations (id, college_id, participant_ids, participant_names, created_at, updated_at)
    VALUES (
        v_conv_id,
        v_sender_profile.college_id,
        jsonb_build_array(v_sender_id, p_target_user_id),
        jsonb_build_object(v_sender_id, v_sender_profile.name, p_target_user_id, v_target_profile.name),
        now(),
        now()
    );

    INSERT INTO conversation_participants (conversation_id, user_id, role, college_id)
    VALUES
        (v_conv_id, v_sender_id, v_sender_profile.role, v_sender_profile.college_id),
        (v_conv_id, p_target_user_id, v_target_profile.role, v_target_profile.college_id);

    SELECT jsonb_build_object(
        'id', v_conv_id,
        'college_id', v_sender_profile.college_id,
        'participant_ids', jsonb_build_array(v_sender_id, p_target_user_id),
        'participant_names', jsonb_build_object(v_sender_id, v_sender_profile.name, p_target_user_id, v_target_profile.name),
        'last_message', NULL,
        'last_message_at', now(),
        'created_at', now(),
        'target_name', v_target_profile.name,
        'target_role', v_target_profile.role,
        'target_avatar', v_target_profile.avatar_url,
        'is_new', true
    ) INTO v_result;

    RETURN v_result;
END;
$$;

-- Send Message RPC
CREATE OR REPLACE FUNCTION send_communication_message(
    p_conversation_id text,
    p_content text,
    p_sender_id text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_sender_id text;
    v_clean_content text := TRIM(p_content);
    v_conv record;
    v_receiver_id text;
    v_sender_profile record;
    v_msg_id uuid;
    v_now timestamptz := now();
    v_result jsonb;
    elem text;
BEGIN
    v_sender_id := COALESCE(p_sender_id, auth.uid()::text);
    IF v_sender_id IS NULL THEN
        RAISE EXCEPTION 'Sender ID is required';
    END IF;

    IF v_clean_content = '' THEN
        RAISE EXCEPTION 'Message content cannot be empty';
    END IF;

    SELECT id, college_id, participant_ids INTO v_conv
    FROM conversations
    WHERE id = p_conversation_id LIMIT 1;

    IF v_conv.id IS NULL THEN
        RAISE EXCEPTION 'Conversation not found';
    END IF;

    IF NOT (v_conv.participant_ids @> jsonb_build_array(v_sender_id)) THEN
        RAISE EXCEPTION 'User is not a participant in this conversation';
    END IF;

    FOR elem IN SELECT jsonb_array_elements_text(v_conv.participant_ids)
    LOOP
        IF elem <> v_sender_id THEN
            v_receiver_id := elem;
        END IF;
    END LOOP;

    IF v_receiver_id IS NULL THEN
        v_receiver_id := v_sender_id;
    END IF;

    IF can_communicate(v_sender_id, v_receiver_id) = false THEN
        RAISE EXCEPTION 'Communication not permitted between sender and receiver';
    END IF;

    SELECT name, role, college_id INTO v_sender_profile FROM profiles WHERE id::text = v_sender_id LIMIT 1;

    v_msg_id := gen_random_uuid();

    INSERT INTO messages (
        id, conversation_id, college_id, sender_id, receiver_id, content, sender_name, sender_role, created_at, updated_at
    ) VALUES (
        v_msg_id, p_conversation_id, v_conv.college_id, v_sender_id, v_receiver_id, v_clean_content, v_sender_profile.name, v_sender_profile.role, v_now, v_now
    );

    UPDATE conversations
    SET last_message = v_clean_content,
        last_message_at = v_now,
        updated_at = v_now
    WHERE id = p_conversation_id;

    SELECT jsonb_build_object(
        'id', v_msg_id,
        'conversation_id', p_conversation_id,
        'college_id', v_conv.college_id,
        'sender_id', v_sender_id,
        'receiver_id', v_receiver_id,
        'content', v_clean_content,
        'sender_name', v_sender_profile.name,
        'sender_role', v_sender_profile.role,
        'read_at', NULL,
        'created_at', v_now
    ) INTO v_result;

    RETURN v_result;
END;
$$;

-- Read State RPC
CREATE OR REPLACE FUNCTION mark_messages_as_read(
    p_conversation_id text,
    p_user_id text DEFAULT NULL
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id text;
    v_updated_count integer;
BEGIN
    v_user_id := COALESCE(p_user_id, auth.uid()::text);
    IF v_user_id IS NULL THEN
        RETURN 0;
    END IF;

    UPDATE messages
    SET read_at = now()
    WHERE conversation_id = p_conversation_id
      AND receiver_id = v_user_id
      AND read_at IS NULL;

    GET DIAGNOSTICS v_updated_count = ROW_COUNT;
    RETURN v_updated_count;
END;
$$;

-- Fetch User Conversations RPC
CREATE OR REPLACE FUNCTION get_user_conversations(p_user_id text DEFAULT NULL)
RETURNS TABLE (
    id text,
    college_id text,
    participant_ids jsonb,
    target_id text,
    target_name text,
    target_role text,
    target_avatar text,
    last_message text,
    last_message_at timestamptz,
    unread_count bigint,
    created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id text;
    v_college_id text;
BEGIN
    v_user_id := COALESCE(p_user_id, auth.uid()::text);
    IF v_user_id IS NULL THEN
        RETURN;
    END IF;

    SELECT college_id INTO v_college_id FROM profiles WHERE id::text = v_user_id LIMIT 1;
    IF v_college_id IS NULL THEN
        RETURN;
    END IF;

    RETURN QUERY
    WITH user_convs AS (
        SELECT c.*
        FROM conversations c
        WHERE c.college_id = v_college_id
          AND c.participant_ids @> jsonb_build_array(v_user_id)
    )
    SELECT
        uc.id,
        uc.college_id,
        uc.participant_ids,
        other_p.id::text AS target_id,
        other_p.name AS target_name,
        other_p.role AS target_role,
        other_p.avatar_url AS target_avatar,
        uc.last_message,
        uc.last_message_at,
        (
            SELECT COUNT(*)
            FROM messages m
            WHERE m.conversation_id = uc.id
              AND m.receiver_id = v_user_id
              AND m.read_at IS NULL
        )::bigint AS unread_count,
        uc.created_at
    FROM user_convs uc
    CROSS JOIN LATERAL (
        SELECT jsonb_array_elements_text(uc.participant_ids) AS pid
    ) pids
    JOIN profiles other_p ON other_p.id::text = pids.pid
    WHERE pids.pid <> v_user_id
    ORDER BY COALESCE(uc.last_message_at, uc.created_at) DESC;

    RETURN;
END;
$$;

-- Row Level Security
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their conversations"
ON conversations FOR SELECT
USING (
    participant_ids @> jsonb_build_array(auth.uid()::text)
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

CREATE POLICY "Users can insert conversations if allowed"
ON conversations FOR INSERT
WITH CHECK (
    participant_ids @> jsonb_build_array(auth.uid()::text)
);

CREATE POLICY "Users can update their conversations"
ON conversations FOR UPDATE
USING (
    participant_ids @> jsonb_build_array(auth.uid()::text)
);

CREATE POLICY "Users can view messages of their conversations"
ON messages FOR SELECT
USING (
    sender_id = auth.uid()::text OR receiver_id = auth.uid()::text
    OR EXISTS (
        SELECT 1 FROM conversations c
        WHERE c.id = messages.conversation_id
          AND c.participant_ids @> jsonb_build_array(auth.uid()::text)
    )
);

CREATE POLICY "Users can insert messages to allowed conversations"
ON messages FOR INSERT
WITH CHECK (
    sender_id = auth.uid()::text AND can_communicate(sender_id, receiver_id) = true
);

CREATE POLICY "Users can update messages they received (e.g. read_at)"
ON messages FOR UPDATE
USING (
    receiver_id = auth.uid()::text OR sender_id = auth.uid()::text
);

-- Enable Realtime
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE messages;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'conversations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
  END IF;
END $$;
