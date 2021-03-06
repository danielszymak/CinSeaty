import React from "react";
import AppContext from "../../context";
import axios from "axios";
import Seat from "./Seat";
import "./Theater.css";
import ReservationTickets from "../ReservationTickets/ReservationTickets";

class Theather extends React.Component {
  state = {
    reservedSeats: [],
    next: false,
    halls: [],
    seats: [],
    programme_id: ""
  };

  printRows = () => {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "I", "J"];
    return rows.map(value => {
      const row = [];
      row[0] = <Seat number={value} className="letter" key={value + 0} />;
      for (let i = 1; i < 16; i++) {
        let number = i < 8 ? i : i - 1;
        let id;
        this.state.halls.forEach(item => {
          if (item.seat_row === value && item.seat === number) {
            id = item._id;
          }
        });
        row[i] = (
          <Seat
            number={number}
            coords={value + number}
            id={id}
            idsGetter={this.idsGetter}
          />
        );
        if (this.state.reservedSeats.includes(value + number)) {
          row[i] = (
            <Seat number={number} coords={value + number} className="taken" />
          );
        }
        if (i === 8) {
          row[i] = <br />;
        }
      }
      return row;
    });
  };
 
  componentDidMount() {
    let reservations;
    axios.get("http://localhost:3001/api/reservations").then(res => {
      reservations = [...res.data];
      reservations.forEach(item => {
        if (item.programme_id === this.props.programme_id) {
        item.seats.forEach(item => {
          this.setState({
            reservedSeats: [...this.state.reservedSeats, item.seat]
          });
        });
        }
      });
      axios.get("http://localhost:3001/api/halls").then(res => {
        this.setState({ halls: [...res.data] });
      });
    });
    // this.setState({programme_id: this.props.programme_id})
  }

  idsGetter = ids => {
    this.setState({ seats: [] });
    setTimeout(() => {
      ids.forEach(id =>
        this.setState({ seats: [...this.state.seats, { seat_id: id }] })
      );
    }, 50);
  };

  onSubmit(e) {
    e.preventDefault();
    this.setState({ next: true });
    console.log(this.state.seats);
  }

  render() {
    if (!this.state.next) {
      return (
        <div>
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>
      <div className="theatre-container">
      <p>Choose a place:</p>

        <div className="seats-container">{this.printRows()}</div>
        <form onSubmit={this.onSubmit.bind(this)}>
          <button type="submit" value="confirm" className="theatre-next-button">
            <i className="">Next</i>
          </button>
        </form></div>
        </div>
      );
    }
    return (
      <AppContext.Consumer>
        {context => (
          <div>
            <ReservationTickets
              reservation={{ ...context }}
              seats={this.state.seats}
            />
          </div>
        )}
      </AppContext.Consumer>
    );
  }
}

export default Theather;
