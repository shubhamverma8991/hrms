import React from 'react'
import AttendanceDashboard from './AttendanceDashboard'
import AttendanceHistory from './AttendanceHistory'
import AttendancePage from './Attendancepage'
import AttendanceTable from './AttendanceTable'
function Attendance() {
    return (
        <>
        <AttendanceDashboard/>
        <AttendanceHistory/>
        <AttendancePage/>
        <AttendanceTable/>
        </>
    )
}

export default Attendance;
