import {
    Streamlit,
    StreamlitComponentBase,
    withStreamlitConnection,
} from "streamlit-component-lib"
import React, { ReactNode, useEffect, useState } from "react"
import Confetti from 'react-confetti'

class Bingo extends StreamlitComponentBase {
    constructor(props) {
        super(props);
        this.state = {
            position: [
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 1, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0]
            ],
            winner: false
        };
    }

    bingo() {
        console.log("BINGO!")
        // Streamlit.setComponentValue(true)
        // this.setState(prevState => ({ ...prevState, prevState.winner: true}))
        this.setState(prevState => ({
            winner: true
        }));
    }

    check_bingo() {
        let is_winner = false

        let p = this.state.position
        for (let r = 0; r < 5; r++) {
            let score = 0
            for (let c = 0; c < 5; c++) {
                score += p[r][c]
            }
            if (score === 5) {
                this.bingo()
                is_winner = true
            }
        }
        for (let c = 0; c < 5; c++) {
            let score = 0
            for (let r = 0; r < 5; r++) {
                score += p[r][c]
            }
            if (score === 5) {
                this.bingo()
                is_winner = true
            }
        }

        if ((p[0][0] + p[1][1] + p[2][2] + p[3][3] + p[4][4]) === 5) {
            this.bingo()
            is_winner = true
        }

        if ((p[4][0] + p[3][1] + p[2][2] + p[1][3] + p[0][4]) === 5) {
            this.bingo()
            is_winner = true
        }

        this.setState(prevState => ({
            winner: is_winner
        }));
    }

    componentDidMount() {
        Streamlit.setComponentValue(this.props.args["value"])
        Streamlit.setFrameHeight()
    }


    render() {
        const center_piece = this.props.args["center_piece"] === undefined ? 'https://www.snowflake.com/wp-content/themes/snowflake/img/favicons/apple-touch-icon.png' : this.props.args["center_piece"]
        const options = this.props.args["bingo_options"] === undefined ? ['B', 'I', 'N', 'G', 'O'] : (this.props.args["bingo_options"])

        var incr = 0
        var i = -1

        return (<>
            <Confetti
                run={this.state.winner}
                height={700}
            />
            <table>
                <thead>
                    <tr>
                        <td>B</td>
                        <td>I</td>
                        <td>N</td>
                        <td>G</td>
                        <td>O</td>
                    </tr>
                </thead>
                <tbody>
                    {[0, 0, 0, 0, 0].map((r_val, r) => {
                        return (
                            <tr key={`r${r}`}>
                                {[0, 0, 0, 0, 0].map((c_val, c) => {
                                    i++
                                    if (options[i] === undefined) {
                                        i = -1
                                    }
                                    incr++
                                    return (
                                        <td key={`r${r}c${c}`}>
                                            {(r === 2 & c === 2) ? <img src={center_piece} width="90%" alt="Free Space" />
                                                :
                                                <>
                                                    <input
                                                        type="checkbox"
                                                        className="btnControl"
                                                        id={`btnControl${incr}`}
                                                        onChange={(e) => {
                                                            this.state.position[r][c] = e.target.checked ? 1 : 0
                                                            this.setState(prevState => this.state.position)
                                                            this.check_bingo()
                                                        }}
                                                    />
                                                    <label className="btn" htmlFor={`btnControl${incr}`}>
                                                        <img src={center_piece} width="90%" alt="Bingo Marker" />
                                                        <div>
                                                            {(options[i].startsWith('http://') | options[i].startsWith('https://')) ? <img src={options[i]} width="50%" alt="Bingo Option" /> : options[i]}
                                                        </div>
                                                    </label>
                                                </>
                                            }
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>

        </>)
    }
}

export default withStreamlitConnection(Bingo)