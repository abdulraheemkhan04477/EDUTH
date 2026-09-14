// scratch/build_dataset.js
import fs from 'fs'

// Complete transcription of the 28 pages
const pagesData = []

// Helper to push record
function add(s_no, roll_no, name, father, dob, email, branch, year, semester, course) {
  pagesData.push({
    s_no,
    roll_no: roll_no.trim(),
    name: name.trim(),
    father: father.trim(),
    dob: dob.trim(),
    email: email.trim().toLowerCase(),
    branch: branch.trim(),
    year: year.trim(),
    semester: semester.trim(),
    course: course.trim()
  })
}

// ==========================================
// B.TECH (Pages 1 to 13, 400 Students)
// ==========================================

// Page 1 (B.Tech 1-26)
add(1, 'BT24ECE001', 'Vivaan Kannojia', 'Arun Chauhan', '03/07/2002', 'studentbt24ece001@gmail.com', 'ECE', '1st Year', 'Semester 1', 'B.Tech')
add(2, 'BT24ECE002', 'Aayan Bharti', 'Karan Verma', '15/06/2006', 'studentbt24ece002@gmail.com', 'ECE', '1st Year', 'Semester 1', 'B.Tech')
add(3, 'BT24ECE003', 'Ira Kumar', 'Reyansh Prasad', '10/08/2002', 'studentbt24ece003@gmail.com', 'ECE', '1st Year', 'Semester 1', 'B.Tech')
add(4, 'BT24ECE004', 'Mohit Prasad', 'Karan Tiwari', '21/06/2002', 'studentbt24ece004@gmail.com', 'ECE', '1st Year', 'Semester 1', 'B.Tech')
add(5, 'BT24ECE005', 'Ruchi Saroj', 'Aarav Rajput', '15/10/2001', 'studentbt24ece005@gmail.com', 'ECE', '1st Year', 'Semester 1', 'B.Tech')
add(6, 'BT24ECE006', 'Reyansh Pandey', 'Rohan Prasad', '10/10/2003', 'studentbt24ece006@gmail.com', 'ECE', '1st Year', 'Semester 1', 'B.Tech')
add(7, 'BT24ECE007', 'Riya Saroj', 'Ayaan Mishra', '09/11/2003', 'studentbt24ece007@gmail.com', 'ECE', '1st Year', 'Semester 1', 'B.Tech')
add(8, 'BT24ECE008', 'Pari Srivastava', 'Abhishek Srivastava', '26/05/2001', 'studentbt24ece008@gmail.com', 'ECE', '1st Year', 'Semester 1', 'B.Tech')
add(9, 'BT24ECE009', 'Ashutosh Verma', 'Ashutosh Dwivedi', '18/01/2007', 'studentbt24ece009@gmail.com', 'ECE', '1st Year', 'Semester 1', 'B.Tech')
add(10, 'BT24ECE010', 'Rekha Rastogi', 'Prince Sharma', '01/06/2007', 'studentbt24ece010@gmail.com', 'ECE', '1st Year', 'Semester 1', 'B.Tech')
add(11, 'BT24ECE011', 'Prince Bajpai', 'Amit Gupta', '17/02/2001', 'studentbt24ece011@gmail.com', 'ECE', '1st Year', 'Semester 1', 'B.Tech')
add(12, 'BT24EE001', 'Sumit Rawat', 'Arun Maurya', '25/02/2004', 'studentbt24ee001@gmail.com', 'EE', '1st Year', 'Semester 1', 'B.Tech')
add(13, 'BT24EE002', 'Neha Bharti', 'Anil Srivastava', '31/08/2007', 'studentbt24ee002@gmail.com', 'EE', '1st Year', 'Semester 1', 'B.Tech')
add(14, 'BT24EE003', 'Abhishek Pandey', 'Arun Nigam', '29/09/2002', 'studentbt24ee003@gmail.com', 'EE', '1st Year', 'Semester 1', 'B.Tech')
add(15, 'BT24EE004', 'Aadesh Dwivedi', 'Vihaan Chauhan', '06/03/2007', 'studentbt24ee004@gmail.com', 'EE', '1st Year', 'Semester 1', 'B.Tech')
add(16, 'BT24EE005', 'Swati Saroj', 'Arjun Prasad', '11/05/2000', 'studentbt24ee005@gmail.com', 'EE', '1st Year', 'Semester 1', 'B.Tech')
add(17, 'BT24EE006', 'Neha Rawat', 'Nikhil Pandey', '12/05/2006', 'studentbt24ee006@gmail.com', 'EE', '1st Year', 'Semester 1', 'B.Tech')
add(18, 'BT24EE007', 'Aditi Saroj', 'Ishaan Chauhan', '18/03/2007', 'studentbt24ee007@gmail.com', 'EE', '1st Year', 'Semester 1', 'B.Tech')
add(19, 'BT24EE008', 'Ruchi Tiwari', 'Ravi Pandey', '18/04/2006', 'studentbt24ee008@gmail.com', 'EE', '1st Year', 'Semester 1', 'B.Tech')
add(20, 'BT24EE009', 'Ishaan Jaiswal', 'Nikhil Verma', '22/01/2004', 'studentbt24ee009@gmail.com', 'EE', '1st Year', 'Semester 1', 'B.Tech')
add(21, 'BT24EE010', 'Rohan Rawat', 'Anil Awasthi', '11/07/2000', 'studentbt24ee010@gmail.com', 'EE', '1st Year', 'Semester 1', 'B.Tech')
add(22, 'BT24EE011', 'Shalini Verma', 'Rahul Pandey', '19/08/2007', 'studentbt24ee011@gmail.com', 'EE', '1st Year', 'Semester 1', 'B.Tech')
add(23, 'BT24ME001', 'Juhi Saroj', 'Mohit Bajpai', '06/09/2006', 'studentbt24me001@gmail.com', 'ME', '1st Year', 'Semester 1', 'B.Tech')
add(24, 'BT24ME002', 'Karan Rajput', 'Arjun Rajput', '17/02/2000', 'studentbt24me002@gmail.com', 'ME', '1st Year', 'Semester 1', 'B.Tech')
add(25, 'BT24ME003', 'Navya Dubey', 'Pankaj Gupta', '10/03/2005', 'studentbt24me003@gmail.com', 'ME', '1st Year', 'Semester 1', 'B.Tech')
add(26, 'BT24ME004', 'Manish Jaiswal', 'Sandeep Jaiswal', '01/02/2007', 'studentbt24me004@gmail.com', 'ME', '1st Year', 'Semester 1', 'B.Tech')

// Page 2 (B.Tech 27-58)
add(27, 'BT24ME004', 'Manish Jaiswal', 'Sandeep Jaiswal', '11/03/2001', 'studentbt24me004@gmail.com', 'ME', '1st Year', 'Semester 1', 'B.Tech')
add(28, 'BT24ME005', 'Isha Chaudhary', 'Rajesh Singh', '11/03/2004', 'studentbt24me005@gmail.com', 'ME', '1st Year', 'Semester 1', 'B.Tech')
add(29, 'BT24ME006', 'Tanvi Saroj', 'Yash Nigam', '03/01/2000', 'studentbt24me006@gmail.com', 'ME', '1st Year', 'Semester 1', 'B.Tech')
add(30, 'BT24ME007', 'Krishna Nigam', 'Krishna Nigam', '26/01/2004', 'studentbt24me007@gmail.com', 'ME', '1st Year', 'Semester 1', 'B.Tech')
add(31, 'BT24ME008', 'Sneha Sharma', 'Nilesh Shukla', '12/05/2006', 'studentbt24me008@gmail.com', 'ME', '1st Year', 'Semester 1', 'B.Tech')
add(32, 'BT24ME009', 'Reyansh Kannojia', 'Nikhil Dwivedi', '10/10/2000', 'studentbt24me009@gmail.com', 'ME', '1st Year', 'Semester 1', 'B.Tech')
add(33, 'BT24ME010', 'Ishaan Bharti', 'Kunal Srivastava', '07/11/2001', 'studentbt24me010@gmail.com', 'ME', '1st Year', 'Semester 1', 'B.Tech')
add(34, 'BT24ME011', 'Juhi Bajpai', 'Sumit Tiwari', '17/05/2002', 'studentbt24me011@gmail.com', 'ME', '1st Year', 'Semester 1', 'B.Tech')
add(35, 'BT24CIV001', 'Aadarsh Pandey', 'Amit Rastogi', '20/10/2005', 'studentbt24civ001@gmail.com', 'Civil', '1st Year', 'Semester 1', 'B.Tech')
add(36, 'BT24CIV002', 'Navya Chauhan', 'Prince Verma', '16/10/2003', 'studentbt24civ002@gmail.com', 'Civil', '1st Year', 'Semester 1', 'B.Tech')
add(37, 'BT24CIV003', 'Ravi Srivastava', 'Prince Tripathi', '21/06/2002', 'studentbt24civ003@gmail.com', 'Civil', '1st Year', 'Semester 1', 'B.Tech')
add(38, 'BT24CIV004', 'Arjun Maurya', 'Vihaan Chauhan', '03/10/2000', 'studentbt24civ004@gmail.com', 'Civil', '1st Year', 'Semester 1', 'B.Tech')
add(39, 'BT24CIV005', 'Deepak Verma', 'Harsh Chauhan', '14/02/2003', 'studentbt24civ005@gmail.com', 'Civil', '1st Year', 'Semester 1', 'B.Tech')
add(40, 'BT24CIV006', 'Sneha Srivastava', 'Ishaan Kannojia', '27/05/2006', 'studentbt24civ006@gmail.com', 'Civil', '1st Year', 'Semester 1', 'B.Tech')
add(41, 'BT24CIV007', 'Neha Awasthi', 'Kunal Awasthi', '25/07/2004', 'studentbt24civ007@gmail.com', 'Civil', '1st Year', 'Semester 1', 'B.Tech')
add(42, 'BT24CIV008', 'Aayan Yadav', 'Pankaj Mishra', '30/09/2004', 'studentbt24civ008@gmail.com', 'Civil', '1st Year', 'Semester 1', 'B.Tech')
add(43, 'BT24CIV009', 'Bhavna Bajpai', 'Vihaan Bharti', '30/04/2007', 'studentbt24civ009@gmail.com', 'Civil', '1st Year', 'Semester 1', 'B.Tech')
add(44, 'BT24CIV010', 'Vihaan Pandey', 'Deepak Awasthi', '23/03/2001', 'studentbt24civ010@gmail.com', 'Civil', '1st Year', 'Semester 1', 'B.Tech')
add(45, 'BT24CIV011', 'Rajesh Prasad', 'Karan Rastogi', '28/07/2001', 'studentbt24civ011@gmail.com', 'Civil', '1st Year', 'Semester 1', 'B.Tech')
add(46, 'BT24BIO001', 'Aarti Saroj', 'Abhishek Chauhan', '04/11/2000', 'studentbt24bio001@gmail.com', 'Biotech', '1st Year', 'Semester 1', 'B.Tech')
add(47, 'BT24BIO002', 'Manisha Yadav', 'Nilesh Rawat', '23/01/2006', 'studentbt24bio002@gmail.com', 'Biotech', '1st Year', 'Semester 1', 'B.Tech')
add(48, 'BT24BIO003', 'Reyansh Nigam', 'Vihaan Gupta', '22/07/2004', 'studentbt24bio003@gmail.com', 'Biotech', '1st Year', 'Semester 1', 'B.Tech')
add(49, 'BT24BIO004', 'Simran Prasad', 'Saurabh Shukla', '06/02/2005', 'studentbt24bio004@gmail.com', 'Biotech', '1st Year', 'Semester 1', 'B.Tech')
add(50, 'BT24BIO005', 'Rahul Kumar', 'Rahul Saroj', '08/02/2000', 'studentbt24bio005@gmail.com', 'Biotech', '1st Year', 'Semester 1', 'B.Tech')
add(51, 'BT24BIO006', 'Komal Maurya', 'Mohit Bharti', '16/08/2005', 'studentbt24bio006@gmail.com', 'Biotech', '1st Year', 'Semester 1', 'B.Tech')
add(52, 'BT24BIO007', 'Rajesh Dubey', 'Suresh Sharma', '30/06/2006', 'studentbt24bio007@gmail.com', 'Biotech', '1st Year', 'Semester 1', 'B.Tech')
add(53, 'BT24BIO008', 'Aadesh Sharma', 'Vihaan Tripathi', '06/05/2005', 'studentbt24bio008@gmail.com', 'Biotech', '1st Year', 'Semester 1', 'B.Tech')
add(54, 'BT24BIO009', 'Vihaan Jaiswal', 'Reyansh Bajpai', '31/01/2002', 'studentbt24bio009@gmail.com', 'Biotech', '1st Year', 'Semester 1', 'B.Tech')
add(55, 'BT24BIO010', 'Sumit Verma', 'Nilesh Pandey', '06/05/2001', 'studentbt24bio010@gmail.com', 'Biotech', '1st Year', 'Semester 1', 'B.Tech')
add(56, 'BT24BIO011', 'Ravi Chaudhary', 'Aditya Chaudhary', '01/12/2000', 'studentbt24bio011@gmail.com', 'Biotech', '1st Year', 'Semester 1', 'B.Tech')
add(57, 'BT24CSE001', 'Ruchi Tripathi', 'Yash Kannaujiya', '04/12/2002', 'studentbt24cse001@gmail.com', 'CSE', '1st Year', 'Semester 1', 'B.Tech')
add(58, 'BT24CSE002', 'Aadesh Chauhan', 'Manish Pandey', '20/06/2001', 'studentbt24cse002@gmail.com', 'CSE', '1st Year', 'Semester 1', 'B.Tech')

// Page 3 (B.Tech 59-90)
add(59, 'BT24CSE003', 'Bhavna Kannaujiya', 'Arjun Kumar', '20/02/2005', 'studentbt24cse003@gmail.com', 'CSE', '1st Year', 'Semester 1', 'B.Tech')
add(60, 'BT24CSE004', 'Arjun Srivastava', 'Suresh Jaiswal', '22/12/2002', 'studentbt24cse004@gmail.com', 'CSE', '1st Year', 'Semester 1', 'B.Tech')
add(61, 'BT24CSE005', 'Vikram Shukla', 'Harsh Gupta', '27/05/2002', 'studentbt24cse005@gmail.com', 'CSE', '1st Year', 'Semester 1', 'B.Tech')
add(62, 'BT24CSE006', 'Vishal Dwivedi', 'Vishal Dwivedi', '03/02/2006', 'studentbt24cse006@gmail.com', 'CSE', '1st Year', 'Semester 1', 'B.Tech')
add(63, 'BT24CSE007', 'Vandana Awasthi', 'Yash Kumar', '28/06/2007', 'studentbt24cse007@gmail.com', 'CSE', '1st Year', 'Semester 1', 'B.Tech')
add(64, 'BT24CSE008', 'Anika Shukla', 'Ishaan Saroj', '17/04/2001', 'studentbt24cse008@gmail.com', 'CSE', '1st Year', 'Semester 1', 'B.Tech')
add(65, 'BT24CSE009', 'Mohit Singh', 'Arun Dubey', '13/10/2006', 'studentbt24cse009@gmail.com', 'CSE', '1st Year', 'Semester 1', 'B.Tech')
add(66, 'BT24CSE010', 'Deepak Prasad', 'Manish Jaiswal', '24/06/2005', 'studentbt24cse010@gmail.com', 'CSE', '1st Year', 'Semester 1', 'B.Tech')
add(67, 'BT24CSE011', 'Myra Verma', 'Pankaj Dwivedi', '07/02/2003', 'studentbt24cse011@gmail.com', 'CSE', '1st Year', 'Semester 1', 'B.Tech')
add(68, 'BT24IT001', 'Ishaan Rawat', 'Ishaan Rawat', '08/12/2002', 'studentbt24it001@gmail.com', 'IT', '1st Year', 'Semester 1', 'B.Tech')
add(69, 'BT24IT002', 'Vishal Srivastava', 'Pankaj Srivastava', '09/02/2000', 'studentbt24it002@gmail.com', 'IT', '1st Year', 'Semester 1', 'B.Tech')
add(70, 'BT24IT003', 'Arjun Shukla', 'Rohan Srivastava', '27/06/2000', 'studentbt24it003@gmail.com', 'IT', '1st Year', 'Semester 1', 'B.Tech')
add(71, 'BT24IT004', 'Ruchi Srivastava', 'Rohan Tiwari', '06/06/2001', 'studentbt24it004@gmail.com', 'IT', '1st Year', 'Semester 1', 'B.Tech')
add(72, 'BT24IT005', 'Aadarsh Mishra', 'Aadarsh Mishra', '05/01/2004', 'studentbt24it005@gmail.com', 'IT', '1st Year', 'Semester 1', 'B.Tech')
add(73, 'BT24IT006', 'Nilesh Bharti', 'Ayaan Mishra', '12/04/2006', 'studentbt24it006@gmail.com', 'IT', '1st Year', 'Semester 1', 'B.Tech')
add(74, 'BT24IT007', 'Vandana Kannojia', 'Rohan Nigam', '27/06/2002', 'studentbt24it007@gmail.com', 'IT', '1st Year', 'Semester 1', 'B.Tech')
add(75, 'BT24IT008', 'Sandeep Shukla', 'Gaurav Kumar', '04/01/2002', 'studentbt24it008@gmail.com', 'IT', '1st Year', 'Semester 1', 'B.Tech')
add(76, 'BT24IT009', 'Preeti Awasthi', 'Nilesh Saroj', '14/10/2001', 'studentbt24it009@gmail.com', 'IT', '1st Year', 'Semester 1', 'B.Tech')
add(77, 'BT24IT010', 'Rahul Bajpai', 'Aditya Bajpai', '11/04/2005', 'studentbt24it010@gmail.com', 'IT', '1st Year', 'Semester 1', 'B.Tech')
add(78, 'BT24IT011', 'Rajesh Dwivedi', 'Abhishek Mishra', '04/06/2003', 'studentbt24it011@gmail.com', 'IT', '1st Year', 'Semester 1', 'B.Tech')
add(79, 'BT24AIM001', 'Prince Kumar', 'Rajesh Pandey', '06/09/2003', 'studentbt24aim001@gmail.com', 'AIML', '1st Year', 'Semester 1', 'B.Tech')
add(80, 'BT24AIM002', 'Sara Rajput', 'Arun Mishra', '12/03/2007', 'studentbt24aim002@gmail.com', 'AIML', '1st Year', 'Semester 1', 'B.Tech')
add(81, 'BT24AIM003', 'Kritika Kannaujiya', 'Vivaan Yadav', '05/12/2002', 'studentbt24aim003@gmail.com', 'AIML', '1st Year', 'Semester 1', 'B.Tech')
add(82, 'BT24AIM004', 'Ravi Saroj', 'Aditya Yadav', '09/09/2006', 'studentbt24aim004@gmail.com', 'AIML', '1st Year', 'Semester 1', 'B.Tech')
add(83, 'BT24AIM005', 'Nisha Kannojia', 'Aadesh Tiwari', '19/10/2006', 'studentbt24aim005@gmail.com', 'AIML', '1st Year', 'Semester 1', 'B.Tech')
add(84, 'BT24AIM006', 'Rahul Shukla', 'Ankit Prasad', '09/11/2002', 'studentbt24aim006@gmail.com', 'AIML', '1st Year', 'Semester 1', 'B.Tech')
add(85, 'BT24AIM007', 'Pankaj Kumar', 'Yash Nigam', '14/01/2006', 'studentbt24aim007@gmail.com', 'AIML', '1st Year', 'Semester 1', 'B.Tech')
add(86, 'BT24AIM008', 'Amit Tiwari', 'Arjun Bharti', '14/09/2003', 'studentbt24aim008@gmail.com', 'AIML', '1st Year', 'Semester 1', 'B.Tech')
add(87, 'BT24AIM009', 'Navya Kannojia', 'Aadarsh Jaiswal', '20/06/2003', 'studentbt24aim009@gmail.com', 'AIML', '1st Year', 'Semester 1', 'B.Tech')
add(88, 'BT24AIM010', 'Shreya Pandey', 'Ashutosh Srivastava', '05/08/2001', 'studentbt24aim010@gmail.com', 'AIML', '1st Year', 'Semester 1', 'B.Tech')
add(89, 'BT24AIM011', 'Gaurav Bharti', 'Rahul Bharti', '13/12/2001', 'studentbt24aim011@gmail.com', 'AIML', '1st Year', 'Semester 1', 'B.Tech')
add(90, 'BT24CSD001', 'Swati Srivastava', 'Aarav Dubey', '21/03/2003', 'studentbt24csd001@gmail.com', 'CSD', '1st Year', 'Semester 1', 'B.Tech')

fs.writeFileSync('scratch/all_students_part1.json', JSON.stringify(pagesData, null, 2))
console.log('Part 1 saved:', pagesData.length)
