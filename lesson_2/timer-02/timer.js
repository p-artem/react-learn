var BLOCKS = [

];
var Timer = React.createClass({
    getInitialState: function() {
        return {
            seconds: 0,
            timeLeft: '',
            isPaused: true,
            pauseStateClass: 'fa fa-play'
        };
    },

    componentWillMount: function() {
        this.setState({ 
            timeLeft:  this.convertTime()
        });
    },

    tick: function() {
        this.setState({ 
            seconds: this.state.seconds + 1,
            timeLeft:  this.convertTime()
        });
    },

    convertTime: function(){
        var time = this.state.seconds;
        var hours = Math.floor(time / 3600) < 10 ? ("00" + Math.floor(time / 3600)).slice(-2) : Math.floor(time / 3600);
        var minutes = ("00" + Math.floor((time % 3600) / 60)).slice(-2);
        var seconds = ("00" + (time % 3600) % 60).slice(-2);
        return minutes + ":" + seconds
    },

    componentWillUnmount: function() {
        clearInterval(this.timer);
    },

    playPauseTimer: function(event){
        let isPaused = !this.state.isPaused;
        if(isPaused === false) {
            this.timer = setInterval(this.tick, 1000);
        } else {
            clearInterval(this.timer);
        }
         this.setState({ 
            isPaused: isPaused,
            pauseStateClass:  isPaused ? 'fa fa-play' : 'fa fa-pause'
        });
    },

    refreshTimer: function(event){
         this.setState({ 
            seconds: 0,
            timeLeft:  this.convertTime()
        });
    },

    render: function() {
        return (
            <div className="timer">
                <ul>
                  <li className="timer-button playpause" onClick={this.playPauseTimer}><i className={this.state.pauseStateClass} aria-hidden="true"></i></li>
                  <li className="timer-left">{this.state.timeLeft}</li>
                  <li className="timer-button refresh" onClick={this.refreshTimer}><i className="fa fa-refresh" aria-hidden="true"></i></li>
                </ul>
            </div>
        );
    }
});

ReactDOM.render(
    <Timer />,
    document.getElementById('mount-point')
);