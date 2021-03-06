import React from "react";
import axios from "axios";
import Moment from "moment";
import "./index.css";
import AppContext from "../../context";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "../Home/Home";
import Contact from "../Contact/Contact";
import Reservation from "../Reservation/Reservation";
import Navbar from "../../components/Navbar/Navbar";
import MovieDetails from "../../components/MovieDetails/MovieDetails";
import Mateusz from "../Mateusz/Mateusz";
import ConfirmProgramme from "../../components/ConfirmProgramme/ConfirmProgramme";
//import PopUp from "../../components/Pop-up-site/Content";

class Root extends React.Component {
  state = {
    movies: [],
    activeMovie: null,
    activeDate: Moment().format("D.M"),
    isMovieDetailsOpen: false,
    isConfirmProgrammeOpen: false,
    programme_id: null
  };

  componentDidMount() {
    axios.get("http://localhost:3001/api/movies").then(res => {
      // console.log(res.data);
      this.setState({ movies: res.data });
    });
  }

  activeMovie = e => {
    function check(element) {
      if (
        e.target.textContent === element.title ||
        e.target.alt === element.title
      ) {
        return element;
      }
    }
    let x = this.state.movies.find(check);
    this.setState({
      activeMovie: x
    });
  };
  activeMoviee = e => {
    function check(element) {
      if(e.target.parentNode.previousSibling.previousSibling.value === element.title){
        return element;
      }
    }
    let x = this.state.movies.find(check);
    this.setState({
      activeMovie: x
    });
  };

  openMovieDetails = () => {
    this.setState({
      isMovieDetailsOpen: true
    });
  };

  closeMovieDetails = () => {
    this.setState({
      isMovieDetailsOpen: false
    });
  };

  openConfirm = () => {
    this.setState({
      isConfirmProgrammeOpen: true
    });
  };

  closeConfirm = () => {
    this.setState({
      isConfirmProgrammeOpen: false
    });
  };

  updateValue = (key, val) => {
    this.setState({ [key]: val });
  };

  render() {
    const { isMovieDetailsOpen } = this.state;
    const { isConfirmProgrammeOpen } = this.state;
    const contextElements = {
      ...this.state,
      openDetails: this.openMovieDetails,
      closeDetails: this.closeMovieDetails,
      activeMovie: this.activeMovie,
      activeMoviee: this.activeMoviee,
      updateValue: this.updateValue,
      openConfirm: this.openConfirm,
      closeConfirm: this.closeConfirm
    };
    console.log("STAN", this.state);
    return (
      <BrowserRouter>
        <AppContext.Provider value={contextElements}>
          <Navbar value={this.state.movies} 
              openMovieDetails={this.openMovieDetails}
              closeMovieDetails={this.closeMovieDetails}
              activeMoviee={this.state.activeMoviee}
              activeMovie={this.state.activeMovie}/>
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <Home
                  openMovieDetails={this.openMovieDetails}
                  closeMovieDetails={this.closeMovieDetails}
                  activeMovie={this.state.activeMovie}
                  activeDate={this.state.activeDate}
                />
              )}
            />
            <Route path="/contact" component={Contact} />
            <Route path="/reservation" component={Reservation} />
            <Route path="/nodawaj" component={Mateusz}/>
          </Switch>
          {isMovieDetailsOpen && (
            <MovieDetails
              openMovieDetails={this.openMovieDetails}
              closeMovieDetails={this.closeMovieDetails}
              activeMovie={this.state.activeMovie}
            />
          )}
          {isConfirmProgrammeOpen && (
            <ConfirmProgramme {...this.state} movie={this.activeMovie.title} />
          )}
        </AppContext.Provider>
      </BrowserRouter>
    );
  }
}

export default Root;
