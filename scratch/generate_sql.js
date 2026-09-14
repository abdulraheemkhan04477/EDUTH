// scratch/generate_sql.js
import fs from 'fs'

// Data arrays from the 28 pages
// Page 1: B.Tech 1-26
export const btech_p1 = [
  { s_no: 1, roll_no: 'BT24ECE001', name: 'Vivaan Kannojia', father: 'Arun Chauhan', dob: '03/07/2002', email: 'studentbt24ece001@gmail.com', branch: 'ECE', year: '1st Year', semester: 'Semester 1' },
  { s_no: 2, roll_no: 'BT24ECE002', name: 'Aayan Bharti', father: 'Karan Verma', dob: '15/06/2006', email: 'studentbt24ece002@gmail.com', branch: 'ECE', year: '1st Year', semester: 'Semester 1' },
  { s_no: 3, roll_no: 'BT24ECE003', name: 'Ira Kumar', father: 'Reyansh Prasad', dob: '10/08/2002', email: 'studentbt24ece003@gmail.com', branch: 'ECE', year: '1st Year', semester: 'Semester 1' },
  { s_no: 4, roll_no: 'BT24ECE004', name: 'Mohit Prasad', father: 'Karan Tiwari', dob: '21/06/2002', email: 'studentbt24ece004@gmail.com', branch: 'ECE', year: '1st Year', semester: 'Semester 1' },
  { s_no: 5, roll_no: 'BT24ECE005', name: 'Ruchi Saroj', father: 'Aarav Rajput', dob: '15/10/2001', email: 'studentbt24ece005@gmail.com', branch: 'ECE', year: '1st Year', semester: 'Semester 1' },
  { s_no: 6, roll_no: 'BT24ECE006', name: 'Reyansh Pandey', father: 'Rohan Prasad', dob: '10/10/2003', email: 'studentbt24ece006@gmail.com', branch: 'ECE', year: '1st Year', semester: 'Semester 1' },
  { s_no: 7, roll_no: 'BT24ECE007', name: 'Riya Saroj', father: 'Ayaan Mishra', dob: '09/11/2003', email: 'studentbt24ece007@gmail.com', branch: 'ECE', year: '1st Year', semester: 'Semester 1' },
  { s_no: 8, roll_no: 'BT24ECE008', name: 'Pari Srivastava', father: 'Abhishek Srivastava', dob: '26/05/2001', email: 'studentbt24ece008@gmail.com', branch: 'ECE', year: '1st Year', semester: 'Semester 1' },
  { s_no: 9, roll_no: 'BT24ECE009', name: 'Ashutosh Verma', father: 'Ashutosh Dwivedi', dob: '18/01/2007', email: 'studentbt24ece009@gmail.com', branch: 'ECE', year: '1st Year', semester: 'Semester 1' },
  { s_no: 10, roll_no: 'BT24ECE010', name: 'Rekha Rastogi', father: 'Prince Sharma', dob: '01/06/2007', email: 'studentbt24ece010@gmail.com', branch: 'ECE', year: '1st Year', semester: 'Semester 1' },
  { s_no: 11, roll_no: 'BT24ECE011', name: 'Prince Bajpai', father: 'Amit Gupta', dob: '17/02/2001', email: 'studentbt24ece011@gmail.com', branch: 'ECE', year: '1st Year', semester: 'Semester 1' },
  { s_no: 12, roll_no: 'BT24EE001', name: 'Sumit Rawat', father: 'Arun Maurya', dob: '25/02/2004', email: 'studentbt24ee001@gmail.com', branch: 'EE', year: '1st Year', semester: 'Semester 1' },
  { s_no: 13, roll_no: 'BT24EE002', name: 'Neha Bharti', father: 'Anil Srivastava', dob: '31/08/2007', email: 'studentbt24ee002@gmail.com', branch: 'EE', year: '1st Year', semester: 'Semester 1' },
  { s_no: 14, roll_no: 'BT24EE003', name: 'Abhishek Pandey', father: 'Arun Nigam', dob: '29/09/2002', email: 'studentbt24ee003@gmail.com', branch: 'EE', year: '1st Year', semester: 'Semester 1' },
  { s_no: 15, roll_no: 'BT24EE004', name: 'Aadesh Dwivedi', father: 'Vihaan Chauhan', dob: '06/03/2007', email: 'studentbt24ee004@gmail.com', branch: 'EE', year: '1st Year', semester: 'Semester 1' },
  { s_no: 16, roll_no: 'BT24EE005', name: 'Swati Saroj', father: 'Arjun Prasad', dob: '11/05/2000', email: 'studentbt24ee005@gmail.com', branch: 'EE', year: '1st Year', semester: 'Semester 1' },
  { s_no: 17, roll_no: 'BT24EE006', name: 'Neha Rawat', father: 'Nikhil Pandey', dob: '12/05/2006', email: 'studentbt24ee006@gmail.com', branch: 'EE', year: '1st Year', semester: 'Semester 1' },
  { s_no: 18, roll_no: 'BT24EE007', name: 'Aditi Saroj', father: 'Ishaan Chauhan', dob: '18/03/2007', email: 'studentbt24ee007@gmail.com', branch: 'EE', year: '1st Year', semester: 'Semester 1' },
  { s_no: 19, roll_no: 'BT24EE008', name: 'Ruchi Tiwari', father: 'Ravi Pandey', dob: '18/04/2006', email: 'studentbt24ee008@gmail.com', branch: 'EE', year: '1st Year', semester: 'Semester 1' },
  { s_no: 20, roll_no: 'BT24EE009', name: 'Ishaan Jaiswal', father: 'Nikhil Verma', dob: '22/01/2004', email: 'studentbt24ee009@gmail.com', branch: 'EE', year: '1st Year', semester: 'Semester 1' },
  { s_no: 21, roll_no: 'BT24EE010', name: 'Rohan Rawat', father: 'Anil Awasthi', dob: '11/07/2000', email: 'studentbt24ee010@gmail.com', branch: 'EE', year: '1st Year', semester: 'Semester 1' },
  { s_no: 22, roll_no: 'BT24EE011', name: 'Shalini Verma', father: 'Rahul Pandey', dob: '19/08/2007', email: 'studentbt24ee011@gmail.com', branch: 'EE', year: '1st Year', semester: 'Semester 1' },
  { s_no: 23, roll_no: 'BT24ME001', name: 'Juhi Saroj', father: 'Mohit Bajpai', dob: '06/09/2006', email: 'studentbt24me001@gmail.com', branch: 'ME', year: '1st Year', semester: 'Semester 1' },
  { s_no: 24, roll_no: 'BT24ME002', name: 'Karan Rajput', father: 'Arjun Rajput', dob: '17/02/2000', email: 'studentbt24me002@gmail.com', branch: 'ME', year: '1st Year', semester: 'Semester 1' },
  { s_no: 25, roll_no: 'BT24ME003', name: 'Navya Dubey', father: 'Pankaj Gupta', dob: '10/03/2005', email: 'studentbt24me003@gmail.com', branch: 'ME', year: '1st Year', semester: 'Semester 1' },
  { s_no: 26, roll_no: 'BT24ME004', name: 'Manish Jaiswal', father: 'Sandeep Jaiswal', dob: '01/02/2007', email: 'studentbt24me004@gmail.com', branch: 'ME', year: '1st Year', semester: 'Semester 1' }
]

console.log('Sample loaded:', btech_p1.length)
