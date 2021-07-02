import React, { Component, useState } from 'react'
import '../Teams/Team.css';
import { Button, Dropdown, DropdownButton,ToggleButton,ToggleButtonGroup } from 'react-bootstrap'
import { connect } from 'react-redux'
import { getUserProfile,getUserTask} from '../../actions/userProfile';
import {getUserProjects} from '../../actions/userProjects'
import _ from 'lodash'
import { getWeeklySummaries, updateWeeklySummaries } from '../../actions/weeklySummaries'
import moment from 'moment'
import InputRange from 'react-input-range';
import "react-input-range/lib/css/index.css"
// import EditTaskModal from '../Projects/WBS/WBSDetail/EditTask/EditTaskModal'
import EditTaskModal from "./../Projects/WBS/WBSDetail/EditTask/EditTaskModal";
import EditPeopleReportTaskModal from './EditPeopleReportTaskModal'
import Collapse from 'react-bootstrap/Collapse'
import TasksDetail from './TasksDetail'

class PeopleReport extends Component {
  constructor(props) {
    super(props);
    this.props=props
    this.state = {
      userProfile: {},
      userTask:[],
      userProjects:{},
      userId: '',
      isLoading: true,
      infringments:{},
      isAssigned:false,
      isActive:false,
      priority:'',
      status:'',
      hasFilter:true,
      allClassification:[],
      classification:'',
      users:"",
      classificationList:[],
      priorityList:[],
      statusList:[],
    }
    this.setStatus=this.setStatus.bind(this)
    this.setPriority=this.setPriority.bind(this)
    this.setActive=this.setActive.bind(this)
    this.setAssign=this.setAssign.bind(this)
    this.setFilter=this.setFilter.bind(this)
    this.setClassfication=this.setClassfication.bind(this)
    this.setUsers=this.setUsers.bind(this)
  }

  async componentDidMount() {
    if (this.props.match) {
      const { userId } = this.props.match.params.userId
      await this.props.getUserProfile(this.props.match.params.userId)
      await this.props.getUserTask(this.props.match.params.userId)
      await this.props.getUserProjects(this.props.match.params.userId)
      await this.props.getWeeklySummaries(this.props.match.params.userId);
      this.setState({
          userId: this.props.match.params.userId,
          isLoading: false,
          userProfile: {
            ...this.props.userProfile,
          },
          userTask :[
            ...this.props.userTask
          ],
          userProjects:{
              ...this.props.userProjects
          },
          allClassification:
            [...Array.from(new Set(this.props.userTask.map((item) => item.classification)))],
          infringments : this.props.userProfile.infringments
          },()=>
          console.log(this.state.userProjects)
      )
    }
  }

  setActive(activeValue) {
    this.setState((state) => {
      return {
        isActive:activeValue
      }
    });
  }
  setPriority(priorityValue) {
    if (priorityValue!='Filter Off') {
      this.setState((state) => {
        return {
          priority: priorityValue,
          priorityList: this.state.priorityList.concat(priorityValue)

        }
      });
    }
    else{
      this.setState((state) => {
        return {
          priority: priorityValue,
          priorityList: []
        }
      });

    }
  }
  setStatus(statusValue) {
    if (statusValue!='Filter Off') {
      this.setState((state) => {
        return {
          status: statusValue,
          statusList: this.state.statusList.concat(statusValue)

        }
      });
    }
    else{
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
        isAssigned:assignValue
      }
    });
  }

  setFilter(filterValue) {
    this.setState((state) => {
      return {
        isAssigned:false,
        isActive:false,
        priority:'',
        status:'',
        allClassification:[],
        classification:'',
        users:""
      }
    });
  }

  setClassfication(classificationValue) {
    if (classificationValue!='Filter Off') {
      this.setState((state) => {
        return {
          classification: classificationValue,
          classificationList: this.state.classificationList.concat(classificationValue)

        }
      });
    }
    else{
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
        users:userValue
      }
    });
  }

  render() {
    const {
      userProfile,
      infringments,
      userTask,
      userProjects,
      isAssigned,
      isActive,
      priority,
      status,
      hasFilter,
      allClassification,
      classification,
      classificationList,
      priorityList,
      statusList,
      users
    } = this.state
    const {
      firstName,
      lastName,
      weeklyComittedHours,
      totalComittedHours
    } = userProfile

    const ShowCollapse = props => {
      const [open, setOpen] = useState(false);
      return(
        <div>
          <Button
            onClick={() => setOpen(!open)}
            aria-expanded={open}>
            {props.resources.length}     >
          </Button>
          <div>
            {props.resources[0].name}
          </div>

          {props.resources.slice(1).map(resource => (
            <Collapse in={open}>
              <div key={resource._id} white-space="pre-line" white-space="nowrap" className="new-line">
                {resource.name}
              </div>
            </Collapse>
          ))}
        </div>

      )
    }

    // const ShowCollapse = props => {
    //   const [open, setOpen] = useState(false);
    //   return(
    //     <div>
    //       <Button
    //         onClick={() => setOpen(!open)}
    //         aria-expanded={open}>
    //       </Button>
    //       <div>
    //         {props.resources[0].name}
    //       </div>
    //
    //       {props.resources.slice(1).map(resource => (
    //         <Collapse in={open}>
    //           <div key={resource._id} white-space="pre-line" white-space="nowrap" className="new-line">
    //             {resource.name}
    //           </div>
    //         </Collapse>
    //       ))}
    //     </div>
    //
    //   )
    // }

    const UserTask = props => {
      let userTaskList = []
      if (props.userTask.length > 0) {
        let tasks=props.userTask
          tasks = props.userTask.filter(item => item.isActive === props.isActive
            && item.isAssigned === props.isAssigned);
          // if (!(props.priority === "")) {
          //   tasks=props.userTask.filter(item => item.priority == props.priority &&item.isActive === props.isActive
          //     && item.isAssigned === props.isAssigned)
          // }

          // if  (!(props.status === "")) {
          //   tasks=props.userTask.filter(item => item.status == props.status &&item.isActive === props.isActive
          //     && item.isAssigned === props.isAssigned)
          // }
        // if  (!(props.classification === "")) {
        //   tasks=tasks.filter(item => item.classification === props.classification)
        // }
        if (props.priorityList.length>0){
          var i=0
          var get_tasks=[]
          while( i< props.priorityList.length) {
            if (props.priorityList[i] !='Filter Off') {
              for (var j = 0; j < tasks.length; j++) {
                if (tasks[j].priority === props.priorityList[i]) {
                  get_tasks.push(tasks[j])
                }
              }
              i += 1
            }
            else{
              get_tasks=props.tasks_filter
              break
            }
          }
          tasks=get_tasks
        }

        if (props.classificationList.length>0){
          var i=0
          var get_tasks=[]
          while( i< props.classificationList.length) {
            if (props.classificationList[i] !='Filter Off') {
              for (var j = 0; j < tasks.length; j++) {
                if (tasks[j].classification === props.classificationList[i]) {
                  get_tasks.push(tasks[j])
                }
              }
              i += 1
            }
            else{
              get_tasks=props.tasks_filter
              break
            }
          }
          tasks=get_tasks
        }
        if (props.statusList.length>0){
          var i=0
          var get_tasks=[]
          while( i< props.statusList.length) {
            if (props.statusList[i] !='Filter Off') {
              for (var j = 0; j < tasks.length; j++) {
                if (tasks[j].status === props.statusList[i]) {
                  get_tasks.push(tasks[j])
                }
              }
              i += 1
            }
            else{
              get_tasks=props.tasks_filter
              break
            }
          }
          tasks=get_tasks
        }

        if  (!(props.users === "")) {
          let test=[]
          for(var i = 0; i < tasks.length; i++) {
for (var j=0;j< tasks[i].resources.length;j++){
  if (tasks[i].resources[j].name===users){
    test.push(tasks[i])
  }
           }
          }
tasks=test
        }

if (tasks.length>0) {
  userTaskList = tasks.map((task, index) => (
    <tr id={"tr_" + task._id}>
      <th scope="row">
        <div>
          here
          </div>
        {/*<EditPeopleReportTaskModal*/}
        {/*  key={`editTask_${task._id}`}*/}
        {/*  parentNum={task.num}*/}
        {/*  taskId={task._id}*/}
        {/*  wbsId={task.wbsId}*/}
        {/*  parentId1={task.parentId1}*/}
        {/*  parentId2={task.parentId2}*/}
        {/*  parentId3={task.parentId3}*/}
        {/*  mother={task.mother}*/}
        {/*  level={task.level}*/}
        {/*/>*/}
      </th>
      <th scope="row">
        <div>{index + 1}</div>
      </th>
      <td>
        {task.taskName}
      </td>
      <td>
        {task.priority}
      </td>
      <td>
        {task.status}
      </td>
      {/*<td>*/}
      {/*  {task.resources.length<=2 ?*/}
      {/*    task.resources.map(resource => (*/}
      {/*      <div key={resource._id}>{resource.name}</div>*/}
      {/*    ))*/}
      {/*    :*/}
      {/*    <ShowCollapse resources={task.resources}/>*/}
      {/*  }*/}
      {/*</td>*/}


      <td>
        {task.resources.length<=2 ?
          task.resources.map(resource => (
            <div key={resource._id}>{resource.name}</div>
          ))
          :
          <ShowCollapse resources={task.resources}/>
        }
      </td>

      <td className='projects__active--input'>
        {task.isActive ?
          <tasks className="isActive"><i className="fa fa-circle" aria-hidden="true"></i></tasks> :
          <div className="isNotActive"><i className="fa fa-circle-o" aria-hidden="true"></i></div>}
      </td>

      <td className='projects__active--input'>
        {task.isAssigned ?
          <div>Assign</div> :
          <div>Not Assign</div>}
      </td>
      <td className='projects__active--input'>
        {task.classification}
      </td>
      <td className='projects__active--input'>
        {task.estimatedHours.toFixed(2)}
      </td>
      <td>
        {task.startedDatetime}
      </td>
      <td>
        {task.dueDatetime}
      </td>
    </tr>
  ))
}
}
      return (
        <div>
          <h2>Total: {userTaskList.length}</h2>
          <h2>Selected filters</h2>

          <h5>Assignment Options:
            <ToggleButtonGroup type="checkbox" variant="info">
              {/*<ToggleButton variant="info">{isAssigned}</ToggleButton>*/}

              {isAssigned ?
                <ToggleButton variant="info">Assign</ToggleButton>
                :
                <ToggleButton variant="info">Not Assign</ToggleButton>
              }

            </ToggleButtonGroup>
          </h5>
          <h5>Active Options:
            <ToggleButtonGroup type="checkbox" variant="info">

              {isActive ?
                <ToggleButton variant="info">Active</ToggleButton>
                :
                <ToggleButton variant="info">InActive</ToggleButton>
              }
            </ToggleButtonGroup>
          </h5>

          {/*<div>isAssigned:{isAssigned}</div>*/}
          {/*<div>isActive:{isActive.toString()}</div>*/}
<h5>Priority Options:
          <ToggleButtonGroup type="checkbox" variant="info">
            {priorityList.map((c, index) => (
              <ToggleButton variant="info">{c}</ToggleButton>
            ))}
          </ToggleButtonGroup>
  </h5>

          <h5>Status Options:
            <ToggleButtonGroup type="checkbox" variant="info">
              {statusList.map((c, index) => (
                <ToggleButton variant="info">{c}</ToggleButton>
              ))}
            </ToggleButtonGroup>
          </h5>

          <h5>Classification Options:
            <ToggleButtonGroup type="checkbox" variant="info">
              {classificationList.map((c, index) => (
                <ToggleButton variant="info">{c}</ToggleButton>
              ))}
            </ToggleButtonGroup>
          </h5>

          <h5>User Options:
            <ToggleButtonGroup type="checkbox" variant="info">
                <ToggleButton variant="info">{users}</ToggleButton>
            </ToggleButtonGroup>
          </h5>



          {/*<div>status:{statusList}</div>*/}
          {/*<div>classification:{classificationList}</div>*/}
          {/*<div>users:{users}</div>*/}
          <table className="center">
            <table className="table table-bordered table-responsive-sm">
              <thead>
              <tr>
                <th scope="col" id="projects__order">Action</th>
                <th scope="col" id="projects__order">#</th>
                <th scope="col" id="projects__active">Task</th>
                <th scope="col" id="projects__active">Priority</th>
                <th scope="col" id="projects__active">Status</th>
                <th scope="col" >Resources</th>
                <th scope="col" id="projects__active">Active</th>
                <th scope="col" id="projects__active">Assign</th>
                <th scope="col" id="projects__active">Class</th>
                <th scope="col" id="projects__active">Estimated Hours</th>
                <th scope="col" id="projects__active">Start Date</th>
                <th scope="col" id="projects__active">End Date</th>
              </tr>
              </thead>
              <tbody>
              { userTaskList}
              </tbody>
            </table>
          </table>
        </div>
      )
    }
    const UserProject = props => {
      let userProjectList = []
      return (
        <div>
          <h1>User Task</h1>
          { userProjectList }
        </div>
      )
    }

    const ClassificationOptions = props => {
      return (
        <DropdownButton style={{margin:'3px'}} exact id="dropdown-basic-button" title="Classification">
        {props.allClassification.map((c, index) => (
            <Dropdown.Item onClick={()=>this.setClassfication(c)}>{c}</Dropdown.Item>
          ))}

        </DropdownButton>
      )
    };

    const StatusOptions = props => {
      var allStatus=[...Array.from(new Set(props.get_tasks.map((item) => item.status))).sort()]
      allStatus.unshift("Filter Off")
      return (
        <DropdownButton style={{margin:'3px'}} exact id="dropdown-basic-button" title="Status">
          {allStatus.map((c, index) => (
            <Dropdown.Item onClick={()=>this.setStatus(c)}>{c}</Dropdown.Item>
          ))}
        </DropdownButton>
      )
    };

    const UserOptions = props => {
      let users=[]
      props.userTask.map((task, index) => (
        task.resources.map(resource => (
         users.push(resource.name)
        ))
      ))

      users=Array.from(new Set(users)).sort()
      users.unshift("Filter Off")
      return (
        <DropdownButton style={{margin:'3px'}} exact id="dropdown-basic-button" title="Users">
          {users.map((c, index) => (
            <Dropdown.Item onClick={()=>this.setUsers(c)}>{c}</Dropdown.Item>
          ))}
        </DropdownButton>
      )
    };


    const Infringments = props => {
      let BlueSquare = []
      if (props.infringments.length > 0) {
        BlueSquare = props.infringments.map((current, index) => (
          <tr className="teams__tr">
          <td>
            {current.date}
          </td>
          <td>
            {current.description}
          </td>
          </tr>
        ))}
      return (

        <table className="center">
          <table className="table table-bordered table-responsive-sm">
            <thead>
            <tr>
              <th scope="col" id="projects__order">Date</th>
              <th scope="col">description</th>
            </tr>
            </thead>
            <tbody>
            { BlueSquare }
            </tbody>
          </table>
        </table>
      )
    }
    const StartDate = (props) => {
        return (
          <h2>Start Date:{moment(props.userProfile.createdDate).format('YYYY-MM-DD')}</h2>
    )
    };
    const ActiveOptions = props => {
      var allOptions=[...Array.from(new Set(props.get_tasks.map((item) => item.isActive.toString())))]
      return (
        <DropdownButton style={{margin:'3px'}} exact id="dropdown-basic-button" title="Active Options">
          {allOptions.map((c, index) => (
            <Dropdown.Item onClick={()=>this.setActive(c)}>{c}</Dropdown.Item>
          ))}
        </DropdownButton>
      )
    };

    // const AssignmentOptions = props => {
    //   var allOptions=[...Array.from(new Set(props.get_tasks.map((item) => item.isAssigned.toString()))).sort()]
    //   allOptions.unshift("Filter Off")
    //   return (
    //     <DropdownButton style={{margin:'3px'}} exact id="dropdown-basic-button" title="Assignment Options">
    //       {allOptions.map((c, index) => (
    //         <Dropdown.Item onClick={()=>this.setAssign(c)}>{c}</Dropdown.Item>
    //       ))}
    //     </DropdownButton>
    //   )
    // };

    const PriorityOptions = props => {
      var allPriorities=[...Array.from(new Set(props.get_tasks.map((item) => item.priority))).sort()]
      allPriorities.unshift("Filter Off")
      return (
        <DropdownButton style={{margin:'3px'}} exact id="dropdown-basic-button" title="Priority">
          {allPriorities.map((c, index) => (
            <Dropdown.Item onClick={()=>this.setPriority(c)}>{c}</Dropdown.Item>
          ))}
        </DropdownButton>
      )
    };

    return (
        <table>
          <DropdownButton id="dropdown-basic-button" title="Time Frame">
            <Dropdown.Item href="#/action-1">Past Week</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Past Two Weeks</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Past Month</Dropdown.Item>
            <Dropdown.Item href="#/action-4">Past 6 Months</Dropdown.Item>
            <Dropdown.Item href="#/action-5">Past Year</Dropdown.Item>
            <Dropdown.Item href="#/action-6">Custom range</Dropdown.Item>
          </DropdownButton>
          <div>
            <h1
              style={{ display: 'inline-block', marginRight: 10 }}
            >Name: {`${firstName} ${lastName}`}</h1>
            <h2>Weekly Comitted Hours:{weeklyComittedHours}</h2>
            <h2>Total Comitted Hours:{totalComittedHours}</h2>
            <StartDate userProfile={userProfile}/>
            <Infringments infringments={infringments}/>
          </div>
            <h2>Tasks</h2>
          <div>
            <button style={{margin:'3px'}} exact className="btn btn-secondary btn-bg mt-3" onClick={()=>this.setFilter()}>Filter Off</button>
            {/*<AssignmentOptions get_tasks={userTask}/>*/}

<div>
            <input name='radio' type="radio" style={{margin:'5px'}} value="active" onChange={()=>this.setAssign(true)}  />
            Assign
            <input name='radio' type="radio" style={{margin:'5px'}} value="inactive" onChange={()=>this.setAssign(false) } />
            Not Assign
</div>
            <div>
            <input name='radio' type="radio" style={{margin:'5px'}} value="active" onChange={()=>this.setActive(true)}  />
            Active
            <input name='radio' type="radio" style={{margin:'5px'}} value="inactive" onChange={()=>this.setActive(false) } />
            InActive
              </div>
            <PriorityOptions get_tasks={userTask}/>
            <StatusOptions get_tasks={userTask}/>
            <button style={{margin:'3px'}} exact className="btn btn-secondary btn-bg mt-3">Estimated Hours</button>
            <ClassificationOptions allClassification={allClassification}/>
            <UserOptions userTask={userTask}/>
          </div>

            <UserTask userTask={userTask}
                      isAssigned={isAssigned}
                      isActive={isActive}
                      priority={priority}
                      status={status}
                      classification={classification}
                       users={users}
                      classificationList={classificationList}
                      priorityList={priorityList}
                      statusList={statusList}
            />
          <h2>Projects</h2>
          <UserProject userProjects={userProjects}/>
        </table>
      )
    }
}


const mapStateToProps = state => ({
  auth: state.auth,
  userProfile: state.userProfile,
  userTask: state.userTask,
  infringments: state.userProfile.infringments,
  user: _.get(state, 'user', {}),
  timeEntries: state.timeEntries,
  userProjects: state.userProjects,
  allProjects: _.get(state, 'allProjects'),
  allTeams: state,
  isAssigned:state.isAssigned,
  isActive:state.isActive,
  priority:state.priority,
  status:state.status,
  hasFilter: state.hasFilter,
  allClassification:state.allClassification,
  classification:state.classification,
  users:state.users,
  classificationList:state.classificationList,
  priorityList:state.priorityList,
  statusList:state.statusList,
});

export default connect(mapStateToProps, {
  getUserProfile,
  getWeeklySummaries,
  updateWeeklySummaries,
  getUserTask,
  getUserProjects
})(PeopleReport);
