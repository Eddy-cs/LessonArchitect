import { Fragment, useState, useEffect } from "react";
import { 
 Typography, 
 Card, 
 TableContainer, 
 Table, 
 TableHead, 
 TableBody, 
 TableRow, 
 TableCell, 
 Paper, 
 Select, 
 MenuItem, 
 FormControl, 
 InputLabel,
 TextField,
 Grid,
 Box 
} from "@mui/material";

function Reports(props) {
 const [lessons, setLessons] = useState();
 const [isLoading, setIsLoading] = useState(false);
 const [reportType, setReportType] = useState('date');
 const [startDate, setStartDate] = useState('');
 const [endDate, setEndDate] = useState('');
 const [subject, setSubject] = useState('all');

 useEffect(() => {
   async function getLessons() {
     const response = await fetch("/api/firebase-config");
     const data = await response.json();
     console.log("Fetched data:", data); // Debug log
     setLessons(data);
     setIsLoading(true);
   }
   getLessons();
 }, []);

 const handleReportTypeChange = (e) => {
   const newType = e.target.value;
   setReportType(newType);
   setStartDate('');
   setEndDate('');
   setSubject('all');
 };

 const formatDateForDisplay = (date) => {
   return new Date(date).toLocaleDateString('en-US', {
     month: 'short',
     day: 'numeric',
     year: 'numeric'
   });
 };

 const getFilteredLessons = () => {
   if (!lessons?.generatedLessons) return [];
   
   let filtered = lessons.generatedLessons;
   console.log("Initial lessons:", filtered); // Debug log

   if (reportType === 'date' && startDate && endDate) {
     filtered = filtered.filter(lesson => {
       // Convert lesson timestamp to Date
       const lessonDate = new Date(lesson.timestamp.seconds * 1000);
       
       // Parse input dates and set to local timezone
       const startDateObj = new Date(startDate + 'T00:00:00');
       const endDateObj = new Date(endDate + 'T23:59:59');

       // Debug logs
       console.log('Filtering lesson:', lesson);
       console.log('Lesson date:', lessonDate);
       console.log('Start date:', startDateObj);
       console.log('End date:', endDateObj);
       console.log('Is within range:', lessonDate >= startDateObj && lessonDate <= endDateObj);

       return lessonDate >= startDateObj && lessonDate <= endDateObj;
     });
     
     console.log("Filtered lessons:", filtered); // Debug log
   }

   if (reportType === 'subject' && subject !== 'all') {
     filtered = filtered.filter(lesson => lesson.subject === subject);
   }

   return filtered;
 };

 const formatDateInput = (dateStr) => {
   const [year, month, day] = dateStr.split('-');
   return `${day}/${month}/${year}`;
 };

 const getUniqueSubjects = () => {
   if (!lessons?.generatedLessons) return [];
   return [...new Set(lessons.generatedLessons.map(lesson => lesson.subject))];
 };

 const getReportStatistics = (filteredLessons) => {
   if (!filteredLessons.length) return null;

   console.log("Calculating statistics for:", filteredLessons); // Debug log

   const statistics = {
     totalLessons: filteredLessons.length,
     subjectBreakdown: {},
     gradeBreakdown: {},
     dateRange: {
       earliest: new Date(Math.min(...filteredLessons.map(l => l.timestamp.seconds * 1000))),
       latest: new Date(Math.max(...filteredLessons.map(l => l.timestamp.seconds * 1000)))
     }
   };

   // Calculate subject and grade breakdowns
   filteredLessons.forEach(lesson => {
     // Subject breakdown
     statistics.subjectBreakdown[lesson.subject] = (statistics.subjectBreakdown[lesson.subject] || 0) + 1;
     
     // Grade breakdown
     statistics.gradeBreakdown[lesson.grade] = (statistics.gradeBreakdown[lesson.grade] || 0) + 1;
   });

   // Calculate most common subject
   const subjects = Object.entries(statistics.subjectBreakdown);
   if (subjects.length > 0) {
     const mostCommonSubject = subjects.sort(([,a], [,b]) => b - a)[0];
     statistics.mostCommonSubject = {
       name: mostCommonSubject[0],
       count: mostCommonSubject[1]
     };
   }

   console.log("Calculated statistics:", statistics); // Debug log
   return statistics;
 };

 const filteredLessons = getFilteredLessons();
 const statistics = getReportStatistics(filteredLessons);

 return (
   <Fragment>
     <Typography variant="h4" sx={{ mb: 5 }}>
       Lesson Reports
     </Typography>

     <Card sx={{ p: 4, mb: 4, backgroundColor: 'white' }}>
       <FormControl fullWidth sx={{ mb: 3 }}>
         <InputLabel>Report Type</InputLabel>
         <Select
           value={reportType}
           label="Report Type"
           onChange={handleReportTypeChange}
         >
           <MenuItem value="date">Lessons by Date Range</MenuItem>
           <MenuItem value="subject">Lessons by Subject</MenuItem>
         </Select>
       </FormControl>

       {reportType === 'date' && (
         <div style={{ 
           display: 'grid', 
           gridTemplateColumns: '1fr 1fr', 
           gap: '20px'
         }}>
           <div>
             <Typography variant="body2" sx={{ mb: 1 }}>Start Date</Typography>
             <TextField
               fullWidth
               type="date"
               value={startDate}
               onChange={(e) => {
                 console.log("New start date:", e.target.value); // Debug log
                 setStartDate(e.target.value);
               }}
               sx={{ backgroundColor: 'white' }}
             />
           </div>
           <div>
             <Typography variant="body2" sx={{ mb: 1 }}>End Date</Typography>
             <TextField
               fullWidth
               type="date"
               value={endDate}
               onChange={(e) => {
                 console.log("New end date:", e.target.value); // Debug log
                 setEndDate(e.target.value);
               }}
               sx={{ backgroundColor: 'white' }}
             />
           </div>
         </div>
       )}

       {reportType === 'subject' && (
         <FormControl fullWidth sx={{ mb: 2 }}>
           <InputLabel>Subject</InputLabel>
           <Select
             value={subject}
             label="Subject"
             onChange={(e) => setSubject(e.target.value)}
           >
             <MenuItem value="all">All Subjects</MenuItem>
             {getUniqueSubjects().map(subject => (
               <MenuItem key={subject} value={subject}>{subject}</MenuItem>
             ))}
           </Select>
         </FormControl>
       )}
     </Card>

     {isLoading && statistics && (
       <Card sx={{ p: 3, mb: 4, backgroundColor: 'white' }}>
         <Typography variant="h6" sx={{ mb: 2 }}>Report Statistics</Typography>
         <Grid container spacing={3}>
           <Grid item xs={12} md={6}>
             <Box sx={{ mb: 2 }}>
               <Typography variant="subtitle2" color="textSecondary">
                 Total Lessons
               </Typography>
               <Typography variant="h4">
                 {statistics.totalLessons}
               </Typography>
             </Box>
             {statistics.mostCommonSubject && (
               <Box sx={{ mb: 2 }}>
                 <Typography variant="subtitle2" color="textSecondary">
                   Most Common Subject
                 </Typography>
                 <Typography variant="body1">
                   {statistics.mostCommonSubject.name} ({statistics.mostCommonSubject.count} lessons)
                 </Typography>
               </Box>
             )}
           </Grid>
           <Grid item xs={12} md={6}>
             <Box sx={{ mb: 2 }}>
               <Typography variant="subtitle2" color="textSecondary">
                 Date Range
               </Typography>
               <Typography variant="body1">
                 {formatDateForDisplay(statistics.dateRange.earliest)} - {formatDateForDisplay(statistics.dateRange.latest)}
               </Typography>
             </Box>
             <Box sx={{ mb: 2 }}>
               <Typography variant="subtitle2" color="textSecondary">
                 Total Subjects
               </Typography>
               <Typography variant="body1">
                 {Object.keys(statistics.subjectBreakdown).length}
               </Typography>
             </Box>
           </Grid>
         </Grid>
       </Card>
     )}

     {isLoading && filteredLessons.length > 0 && (
       <TableContainer component={Paper}>
         <Typography variant="h6" sx={{ p: 2 }}>
           {reportType === 'date' && startDate && endDate && 
             `Lessons by Date Range Report (${formatDateInput(startDate)} - ${formatDateInput(endDate)})`
           }
           {reportType === 'subject' && `Lessons by Subject: ${subject}`}
         </Typography>
         <Table sx={{ minWidth: 650 }}>
           <TableHead>
             <TableRow>
               <TableCell align="center" sx={{ color: 'purple' }}>Actions</TableCell>
               <TableCell sx={{ color: 'purple' }}>Lesson</TableCell>
               <TableCell align="right" sx={{ color: 'purple' }}>Subject</TableCell>
               <TableCell align="right" sx={{ color: 'purple' }}>Grade</TableCell>
               <TableCell align="right" sx={{ color: 'purple' }}>Date</TableCell>
             </TableRow>
           </TableHead>
           <TableBody>
             {filteredLessons.map((row, index) => (
               <TableRow key={index}>
                 <TableCell align="center">
                   {/* Actions */}
                 </TableCell>
                 <TableCell>{row.lessonTitle}</TableCell>
                 <TableCell align="right">{row.subject}</TableCell>
                 <TableCell align="right">{row.grade}</TableCell>
                 <TableCell align="right">
                   {formatDateForDisplay(row.timestamp.seconds * 1000)}
                 </TableCell>
               </TableRow>
             ))}
           </TableBody>
         </Table>
       </TableContainer>
     )}

     {!isLoading && <div>Loading...</div>}
     {isLoading && filteredLessons.length === 0 && (
       <Typography>No lessons found for the selected criteria.</Typography>
     )}
   </Fragment>
 );
}

export default Reports;