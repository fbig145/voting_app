import React from "react";
import {Link} from "react-router-dom";

const Finished = (props) => {
    return (
        <div className="login-container">
            <h1 className="welcome-message">Time elapsed. Voting is Finished</h1>
            <Link to="/">
                <button className="button">Home</button>
            </Link>
        </div>
    )
}

export default Finished;