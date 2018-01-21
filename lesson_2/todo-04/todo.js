const ToDo = React.createClass({
    render() {
        return (
            <li className={"to-do" + (this.props.status ? ' done' : '')}>
                <span
                    className="accept"
                    onClick={this.props.onToDoAccept}
                />
                <span
                    className="text"
                >
                    {this.props.children}
                </span>
                <span
                    className="delete-task"
                    onClick={this.props.onDelete}
                > ×
                </span>
            </li>
        )
    }
});

const ToDoList = React.createClass({
    render(){
        const onToDoDelete = this.props.onToDoDelete;
        const onToDoAccept = this.props.onToDoAccept;

        return (
            <ul className="to-do-list">
                {
                    this.props.tasks.map(task =>
                        <ToDo
                            key={task.id}
                            status={ task.status }
                            onDelete={onToDoDelete.bind(null, task)}
                            onToDoAccept={onToDoAccept.bind(null, task)}>
                            { task.text }
                        </ToDo>
                    )
                }
            </ul>
        );
    }
});

const ToDoAdd = React.createClass({
    getInitialState(){
        return {
            text: ''
        }
    },

    handleChangeInput(e){
        this.setState({text: e.target.value});
    },

    handleKeyPressInput(e){
        const value = e.target.value.replace(/\s{2,}/g, ' ');

        if (e.key === 'Enter' && value) {
            const newTask = {
                id: Date.now(),
                text: value,
                status: false
            };

            this.props.onToDoAdd(newTask);
            this.setState({text: ''});
        }
    },

    render() {
        return (
            <div className="to-do-add">
                <input type="text"
                       placeholder="What you need to do?"
                       onKeyPress = {this.handleKeyPressInput}
                       onChange = {this.handleChangeInput}
                       value={this.state.text}
                />
            </div>
        );
    }
});

const ToDoSort = React.createClass({
    render(){
        const sortButtons = ['all', 'new', 'completed'];
        const onToDoSort = this.props.onToDoSort;
        const currentFilter = this.props.currentFilter;

        return(
            <ul className="to-do-sort">
                {
                    sortButtons.map(name =>
                        <li
                            key={name}
                            className={(name === currentFilter)? 'active': ''}
                            onClick={onToDoSort.bind(null, name)}
                        >
                            {name}
                        </li>
                    )
                }
            </ul>
        );
    }
});

const ToDoListApp = React.createClass({
    getInitialState(){
        return {
            tasks: [],
            filter: 'all'
        }
    },

    componentWillMount(){
        let tasks = localStorage.getItem('tasks');

        if(tasks) {
            tasks = JSON.parse(tasks);
            this.setState({tasks: tasks});
        }
    },

    componentDidUpdate() {
        this._updateLocalStorage();
    },

    onToDoAdd(task){
        const newTasks = this.state.tasks.slice();
        newTasks.unshift(task);

        this.setState({tasks: newTasks});
    },

    onToDoDelete(task){
        const newTasks = this.state.tasks.filter(
            el => el.id !== task.id
        );

        this.setState({tasks: newTasks});
    },

    onToDoAccept(task){
        const newTasks = this.state.tasks.slice();

        newTasks.forEach(el => {
            if(el.id === task.id) {
                el.status = !task.status
            }
        });

        this.setState({tasks: newTasks});
    },

    onToDoSort(filter){
        this.setState({filter: filter});
    },

    render(){
        return (
            <div className="to-do-app">
                <ToDoAdd onToDoAdd={ this.onToDoAdd }/>
                <ToDoList onToDoDelete={ this.onToDoDelete }
                          onToDoAccept={ this.onToDoAccept }
                          tasks={ this._getVisibleToDos(this.state.tasks, this.state.filter) }
                />
                <ToDoSort
                    currentFilter={this.state.filter}
                    onToDoSort={this.onToDoSort}
                />
            </div>
        );
    },

    _getVisibleToDos(todos, filter){
        if (filter === 'completed') {
            return todos.filter(todo => todo.status);
        }
        if (filter === 'new') {
            return todos.filter(todo => !todo.status);
        }

        return todos;
    },
    
    _updateLocalStorage(){
        const tasks = JSON.stringify( this.state.tasks );
        localStorage.setItem('tasks', tasks);
    }
});

ReactDOM.render(
    <ToDoListApp />,
    document.getElementById('mount-point')
);