import React, { Component, useState } from 'react'
import '../../Teams/Team.css';
import './PeopleReport.css';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap'
import { connect } from 'react-redux'
import { getUserProfile, getUserTask } from '../../../actions/userProfile';
import { getUserProjects } from '../../../actions/userProjects'
import _ from 'lodash'
import { getWeeklySummaries, updateWeeklySummaries } from '../../../actions/weeklySummaries'
import moment from 'moment'
import "react-input-range/lib/css/index.css"
import Collapse from 'react-bootstrap/Collapse'
import { getTimeEntriesForPeriod } from '../../../actions/timeEntries'
import InfringmentsViz from '../InfringmentsViz'
import TimeEntriesViz from '../TimeEntriesViz'
import PeopleTableDetails from '../PeopleTableDetails'
import { ReportHeader } from "../sharedComponents/ReportHeader";
import { ReportPage } from "../sharedComponents/ReportPage";
import { getPeopleReportData } from "./selectors";
import { ReportBlock } from '../sharedComponents/ReportBlock';
import { PeopleTasksPieChart } from './components';

class PeopleReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: {},
      userTask: [],
      userProjects: {},
      userId: '',
      isLoading: true,
      infringments: {},
      isAssigned: "",
      isActive: "",
      priority: '',
      status: '',
      hasFilter: true,
      allClassification: [],
      classification: '',
      users: "",
      classificationList: [],
      priorityList: [],
      statusList: [],
      fromDate: "2016-01-01",
      toDate: this.endOfWeek(0),
      timeEntries: {},
      startDate: '',
      endDate: '',
      fetched: false,
    }
    this.setStatus = this.setStatus.bind(this)
    this.setPriority = this.setPriority.bind(this)
    this.setActive = this.setActive.bind(this)
    this.setAssign = this.setAssign.bind(this)
    this.setFilter = this.setFilter.bind(this)
    this.setClassfication = this.setClassfication.bind(this)
    this.setUsers = this.setUsers.bind(this)
    this.setDate = this.setDate.bind(this)
    this.setStartDate = this.setStartDate.bind(this)
    this.setEndDate = this.setEndDate.bind(this)
  }

  async componentDidMount() {
    if (this.props.match) {
      const userId = this.props.match.params.userId;
      await this.props.getUserProfile(userId)
      await this.props.getUserTask(userId)
      await this.props.getUserProjects(userId)
      await this.props.getWeeklySummaries(userId);
      await this.props.getTimeEntriesForPeriod(userId, this.state.fromDate, this.state.toDate)
      this.setState({
        userId,
        isLoading: false,
        userProfile: {
          ...this.props.userProfile,
        },
        userTask: [
          ...this.props.userTask
        ],
        userProjects: {
          ...this.props.userProjects
        },
        allClassification:
          [...Array.from(new Set(this.props.userTask.map((item) => item.classification)))],
        infringments: this.props.userProfile.infringments,
        timeEntries: {
          ...this.props.timeEntries,
        },
      }
      )
    }
  }
  setStartDate(date) {
    this.setState((state) => {
      return {
        startDate: date
      }
    });
  }
  setEndDate(date) {
    this.setState((state) => {
      return {
        endDate: date
      }
    });
  }

  setDate(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  startOfWeek(offset) {
    return moment()
      .tz('America/Los_Angeles')
      .startOf('week')
      .subtract(offset, 'weeks')
      .format('YYYY-MM-DD')
  }

  endOfWeek(offset) {
    return moment()
      .tz('America/Los_Angeles')
      .endOf('week')
      .subtract(offset, 'weeks')
      .format('YYYY-MM-DD')
  }

  setActive(activeValue) {
    this.setState((state) => {
      return {
        isActive: activeValue
      }
    });
  }
  setPriority(priorityValue) {
    if (priorityValue != 'Filter Off') {
      this.setState((state) => {
        return {
          priority: priorityValue,
          priorityList: this.state.priorityList.concat(priorityValue)

        }
      });
    }
    else {
      this.setState((state) => {
        return {
          priority: priorityValue,
          priorityList: []
        }
      });

    }
  }
  setStatus(statusValue) {
    if (statusValue != 'Filter Off') {
      this.setState((state) => {
        return {
          status: statusValue,
          statusList: this.state.statusList.concat(statusValue)

        }
      });
    }
    else {
      this.setState((state) => {
        return {
          status: statusValue,
          statusList: []
        }
      });

    }
  }
  setAssign(assignValue) {
    this.setState((state) => {
      return {
        isAssigned: assignValue
      }
    });
  }

  setFilter(filterValue) {
    this.setState((state) => {
      return {
        isAssigned: false,
        isActive: false,
        priority: '',
        priorityList: [],
        status: '',
        statusList: [],
        classificationList: [],
        classification: '',
        users: "",
        fromDate: "2016-01-01",
        toDate: this.endOfWeek(0),
        startDate: '',
        endDate: ''
      }
    });
  }

  setClassfication(classificationValue) {
    if (classificationValue != 'Filter Off') {
      this.setState((state) => {
        return {
          classification: classificationValue,
          classificationList: this.state.classificationList.concat(classificationValue)

        }
      });
    }
    else {
      this.setState((state) => {
        return {
          classification: classificationValue,
          classificationList: []
        }
      });

    }
  }

  setUsers(userValue) {
    this.setState((state) => {
      return {
        users: userValue
      }
    });
  }

  render() {
    const {
      userProfile,
      infringments,
      userTask,
      userProjects,
      isActive,
      fromDate,
      toDate,
      timeEntries,
    } = this.state
    const {
      firstName,
      lastName,
      weeklyComittedHours,
      totalTangibleHrs
    } = userProfile

    var totalTangibleHrsRound = 0
    if (totalTangibleHrs) {
      totalTangibleHrsRound = totalTangibleHrs.toFixed(2);
    }

    const UserProject = props => {
      let userProjectList = []
      return (
        <div>
          {userProjectList}
        </div>
      )
    }

    const ClassificationOptions = props => {
      return (
        <DropdownButton style={{ margin: '3px' }} exact id="dropdown-basic-button" title="Classification">
          {props.allClassification.map((c, index) => (
            <Dropdown.Item onClick={() => this.setClassfication(c)}>{c}</Dropdown.Item>
          ))}

        </DropdownButton>
      )
    };

    const StatusOptions = props => {
      var allStatus = [...Array.from(new Set(props.get_tasks.map((item) => item.status))).sort()]
      allStatus.unshift("Filter Off")
      return (
        <DropdownButton style={{ margin: '3px' }} exact id="dropdown-basic-button" title="Status">
          {allStatus.map((c, index) => (
            <Dropdown.Item onClick={() => this.setStatus(c)}>{c}</Dropdown.Item>
          ))}
        </DropdownButton>
      )
    };

    const UserOptions = props => {
      let users = []
      props.userTask.map((task, index) => (
        task.resources.map(resource => (
          users.push(resource.name)
        ))
      ))

      users = Array.from(new Set(users)).sort()
      users.unshift("Filter Off")
      return (
        <DropdownButton style={{ margin: '3px' }} exact id="dropdown-basic-button" title="Users">
          {users.map((c, index) => (
            <Dropdown.Item onClick={() => this.setUsers(c)}>{c}</Dropdown.Item>
          ))}
        </DropdownButton>
      )
    };
    const ShowInfringmentsCollapse = props => {
      const [open, setOpen] = useState(false);
      return (
        <div>
          <table className="center">
            <table className="table table-bordered table-responsive-sm">
              <thead>
                <tr>
                  <th scope="col" id="projects__order">
                    <Button variant="light"
                      onClick={() => setOpen(!open)}
                      aria-expanded={open}>
                      ⬇
                    </Button>
                  </th>

                  <th scope="col" id="projects__order">Date</th>
                  <th scope="col">Description</th>
                </tr>
              </thead>
              <Collapse in={open}>
                <tbody>
                  {props.BlueSquare}
                </tbody>
              </Collapse>
            </table>
          </table>

        </div>

      )
    }

    const Infringments = props => {
      let BlueSquare = []
      let dict = {}

      //aggregate infringments
      for (let i = 0; i < props.infringments.length; i++) {
        if (props.infringments[i].date in dict) {
          dict[props.infringments[i].date].count += 1
          dict[props.infringments[i].date].des.push(props.infringments[i].description)
        } else {
          dict[props.infringments[i].date] = { count: 1, des: [props.infringments[i].description] }
        }
      }

      const startdate = Object.keys(dict)[0]
      var startdateStr = ""
      if (startdate) {
        startdateStr = startdate.toString()

      }
      if (props.infringments.length > 0) {
        BlueSquare = props.infringments.map((current, index) => (
          <tr className="teams__tr">
            <td>{index + 1}
            </td>
            <td>
              {current.date}
            </td>
            <td>
              {current.description}
            </td>
          </tr>
        ))
      }
      return (
        <div>

          <div>
          </div>
        </div>
      )
    }

    const PeopleDataTable = props => {
      let peopleData = {
        "alertVisible": false,
        "taskData": [
        ],
        "color": null,
        "message": ""
      }

      for (let i = 0; i < userTask.length; i++) {
        let task = {
          "taskName": "",
          "priority": "",
          "status": "",
          "resources": [],
          "active": "",
          "assign": "",
          "estimatedHours": "",
          "_id": "",
          "startDate": "",
          "endDate": "",
          "hoursBest": "",
          "hoursMost": "",
          "hoursWorst": "",
          "whyInfo": "",
          "endstateInfo": "",
          "intentInfo": "",
        }
        let resourcesName = []

        if (userTask[i].isActive) {
          task.active = "Yes";
        } else {
          task.active = "No";
        }
        if (userTask[i].isAssigned) {
          task.assign = "Yes";
        } else {
          task.assign = "No";
        }
        task.taskName = userTask[i].taskName;
        task.priority = userTask[i].priority;
        task.status = userTask[i].status;
        let n = userTask[i].estimatedHours;
        task.estimatedHours = n.toFixed(2);
        for (let j = 0; j < userTask[i].resources.length; j++) {
          let tempResource = {
            "name": "",
            "profilePic": ""
          }
          if (userTask[i].resources[j].profilePic) {
            tempResource.name = userTask[i].resources[j].name;
            tempResource.profilePic = userTask[i].resources[j].profilePic;
          }
          else {
            tempResource.name = userTask[i].resources[j].name;
            tempResource.profilePic = "/pfp-default.png";
          }
          resourcesName.push(tempResource);
        }
        task._id = userTask[i]._id;
        task.resources.push(resourcesName);
        if (userTask[i].startedDatetime == null) {
          task.startDate = "null";
        }
        if (userTask[i].endedDatime == null) {
          task.endDate = "null";
        }
        task.hoursBest = userTask[i].hoursBest;
        task.hoursMost = userTask[i].hoursMost;
        task.hoursWorst = userTask[i].hoursWorst;
        task.whyInfo = userTask[i].whyInfo;
        task.intentInfo = userTask[i].intentInfo;
        task.endstateInfo = userTask[i].endstateInfo;
        peopleData.taskData.push(task);
      }

      return (
        <PeopleTableDetails taskData={peopleData.taskData} />
      )
    }

    const renderProfileInfo = () => (
      <ReportHeader src={this.state.userProfile.profilePic} isActive={isActive}>
        <h1 className="heading">{`${firstName} ${lastName}`}</h1>

        <div className="stats">
          <div>
            <h4>{moment(userProfile.createdDate).format('YYYY-MM-DD')}</h4>
            <p>Start Date</p>
          </div>
          <div>
            <h4>{userProfile.endDate ? userProfile.endDate.toLocaleString().split('T')[0] : 'N/A'}</h4>
            <p>End Date</p>
          </div>
        </div>
      </ReportHeader>
    )

    return (
      <ReportPage renderProfile={renderProfileInfo}>

        <div className='people-report-time-logs-wrapper'>
          <ReportBlock firstColor='#ff5e82' secondColor='#e25cb2' className='people-report-time-log-block'>
            <h3>{weeklyComittedHours}</h3>
            <p>Weekly Committed Hours</p>
          </ReportBlock>
          <ReportBlock firstColor='#b368d2' secondColor='#831ec4' className='people-report-time-log-block'>
            <h3>{this.props.tangibleHoursReportedThisWeek}</h3>
            <p>Hours Logged This Week</p>
          </ReportBlock>
          <ReportBlock firstColor='#64b7ff' secondColor='#928aef' className='people-report-time-log-block'>
            <h3>{infringments.length}</h3>
            <p>Blue squares</p>
          </ReportBlock>
          <ReportBlock firstColor='#ffdb56' secondColor='#ff9145' className='people-report-time-log-block'>
            <h3>{totalTangibleHrsRound}</h3>
            <p>Total Hours Logged</p>
          </ReportBlock>
        </div>

        <ReportBlock>
          <PeopleTasksPieChart />
        </ReportBlock>

        <ReportBlock>
          <div className="intro_date">
            <h4>Tasks contributed</h4>
          </div>

          <PeopleDataTable />

          <div className='container'>

            <table>
              <UserProject userProjects={userProjects} />
              <Infringments infringments={infringments} fromDate={fromDate} toDate={toDate} timeEntries={timeEntries} />
              <div className='visualizationDiv'>
                <InfringmentsViz infringments={infringments} fromDate={fromDate} toDate={toDate} />
              </div>
              <div className='visualizationDiv'>
                <TimeEntriesViz timeEntries={timeEntries} fromDate={fromDate} toDate={toDate} />
              </div>
            </table>

          </div>
        </ReportBlock>
      </ReportPage>
    )
  }
}

export default connect(getPeopleReportData, {
  getUserProfile,
  getWeeklySummaries,
  updateWeeklySummaries,
  getUserTask,
  getUserProjects,
  getTimeEntriesForPeriod
})(PeopleReport);
