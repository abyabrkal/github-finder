import React, { Fragment, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';

import Navbar from './components/Navbar'
import Alert from './components/Alert'
import About from './components/About'
import Users from './components/Users';
import User from './components/User';
import Search from './components/Search';



const App = () => {

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [repos, setRepos] = useState([]);


  // Search GitHub users
  const searchUsers = async text => {
    setLoading(true)

    const res = await axios.get(
      `https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_GITHUB_CLIENT_ID}&cleint_secret=${process.env.REACT_GITHUB_CLEINT_SECRET}`
    );

    setUsers(res.data.items)
    setLoading(false)
  }

  // Get single GitHub user
  const getUser = async username => {
    setLoading(true)

    const res = await axios.get(
      `https://api.github.com/users/${username}?client_id=${process.env.REACT_GITHUB_CLIENT_ID}&{client_secret=${process.env.REACT_GITHUB_CLIENT_SECRET}}`
    );

    setUser(res.data)
    setLoading(false)
  }

  // get user repos
  const getUserRepos = async username => {
    setLoading(true)

    const res = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    );

    setRepos(res.data)
    setLoading(false)
  }

  // Clear users from state
  const clearUsers = () => setUsers([])

  // Set Alert
  const showAlert = (msg, type) => {
    setAlert({ msg, type });

    setTimeout(() => setAlert(null), 5000);
  }



    return (
      <Router>
        <div>
          <Navbar />
          <div className="container mx-auto p-4">
            <Alert alert={alert}/>
            <Switch>
              <Route exact path="/" render={props => (
                <Fragment>
                  <Search 
                    searchUsers={searchUsers}
                    clearUsers={clearUsers}
                    showClear={users.length > 0 ? true : false}
                    setAlert={showAlert}
                  />
                  <Users loading={loading} users={users} />
                </Fragment>
              )}/>
              <Route exact path="/about" component={About}/>
              <Route exact path="/user/:login" render={props => (
                <User 
                  {...props}
                  getUser={getUser}
                  getUserRepos={getUserRepos}
                  user={user}
                  loading={loading}
                  repos={repos}
                />
              )}/>
            </Switch>
          </div>
        </div>
      </Router>
    );
  
  
}

export default App;
