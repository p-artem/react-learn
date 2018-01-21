var Note = React.createClass({
    render: function() {
        var style = { backgroundColor: this.props.color };
        return (
            <div className="note" style={style}>
                <span className="delete-note" onClick={this.props.onDelete}> × </span>
                {this.props.children}
            </div>
        );
    }
});

var COLORS = [
    {
        id:1,
        color: '#2ecc71'
    },{
        id:2,
        color: '#3498db'
    },{
        id:3,
        color: '#f1c40f'
    },{
        id:4,
        color: '#e74c3c'
    }
];

var Color = React.createClass({

    render: function() {
        return (
            <div>
                <input 
                    type="radio" id={'color-' + this.props.dataId} 
                    name="color" 
                    value={this.props.color} 
                    defaultChecked={this.props.color == COLORS[0].color}
                    onClick={this.props.onChangeColor}
                />
                <label htmlFor ={'color-' + this.props.dataId}>
                  <span style = {{backgroundColor: this.props.color}}>
                    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/check-icn.svg" alt="Checked Icon" />
                  </span>
                </label>
            </div>
        );
    }
});

var NoteEditor = React.createClass({
    getInitialState: function() {
        return {
            text: '',
            selectColor: COLORS[0].color,
            displayedColors: COLORS
        };
    },

    handleTextChange: function(event) {
        this.setState({ text: event.target.value });
    },

    handleNoteAdd: function() {
        var newNote = {
            text: this.state.text,
            color: this.state.selectColor,
            id: Date.now()
        };

        this.props.onNoteAdd(newNote);
        this.setState({ text: '' });
    },

    handleChangeColor: function(event){
        this.setState({ selectColor: event.target.value });
    },

    render: function() {
         var onChangeColor = this.handleChangeColor;
        return (
            <div className="note-editor">
                <textarea
                    placeholder="Enter your note here..."
                    rows={5}
                    className="textarea"
                    value={this.state.text}
                    onChange={this.handleTextChange}
                />
                <button className="add-button" onClick={this.handleNoteAdd}>Add</button>
                <div className="custom-radios">
                    {
                        this.state.displayedColors.map(function(el){
                            return <Color 
                                key={el.id}
                                dataId={el.id}
                                color={el.color}
                                onChangeColor={onChangeColor} 
                            />;
                        })
                    }
                </div>
            </div>
        );
    }
});

var NotesGrid = React.createClass({
    componentDidMount: function() {
        var grid = this.refs.grid;
        this.msnry = new Masonry( grid, {
            itemSelector: '.note',
            columnWidth: 200,
            gutter: 10,
            isFitWidth: true
        });
    },

    componentDidUpdate: function(prevProps) {
        if (this.props.notes.length !== prevProps.notes.length) {
            this.msnry.reloadItems();
            this.msnry.layout();
        }
    },

    render: function() {
        var onNoteDelete = this.props.onNoteDelete;
        var notesList = (this.props.searchText.length) ? this.props.searchNotes : this.props.notes;
        if(notesList.length){
                return (
                    <div className="notes-grid" ref="grid">
                        {  
                           notesList.map(function(note){
                                return (
                                    <Note
                                        key={note.id}
                                        onDelete={onNoteDelete.bind(null, note)}
                                        color={note.color}>
                                        {note.text}
                                    </Note>
                                );
                            })
                        }
                    </div>
                );
        } else {
            return  (<div className="notes-grid" ref="grid"><h4>Ничего не найдено</h4></div>)
        }
    }
});

var NotesSearch = React.createClass({
    render: function() {
        return (
            <div className="search-block">
                <input type="text" className="search-field" onChange={this.props.onNoteSearch} />
            </div>
        );
    },
});

var NotesApp = React.createClass({
    getInitialState: function() {
        return {
            notes: [],
            searchNotes: [],
            searchText : '',
        };
    },

    componentDidMount: function() {
        var localNotes = JSON.parse(localStorage.getItem('notes'));
        if (localNotes) {
            this.setState({ notes: localNotes, searchNotes: localNotes });
        }
    },

    componentDidUpdate: function() {
        this._updateLocalStorage();
    },

    handleNoteDelete: function(note) {
        var noteId = note.id;
        var newNotes = this.state.notes.filter(function(note) {
            return note.id !== noteId;
        });
        this.setState({ notes: newNotes });
    },

    handleNoteAdd: function(newNote) {
        var newNotes = this.state.notes.slice();
        newNotes.unshift(newNote);
        this.setState({ notes: newNotes });
    },

    handleNoteSearch: function(event){
        var searchQuery = event.target.value;
        var findNotes = this.state.notes.filter(function(note){
            var seachValue = note.text.toLowerCase();
            return seachValue.indexOf(searchQuery) !== -1;
        });

        this.setState({
            searchNotes: findNotes,
            searchText : searchQuery
        }); 
    },

    render: function() {
        return (
            <div className="notes-app">
                <h2 className="app-header">NotesApp</h2>
                <NotesSearch onNoteSearch={this.handleNoteSearch} />
                <NoteEditor onNoteAdd={this.handleNoteAdd} />
                <NotesGrid 
                        notes={this.state.notes} 
                        searchNotes={this.state.searchNotes}
                        searchText = {this.state.searchText} 
                        onNoteDelete={this.handleNoteDelete} 
                />
            </div>
        );
    },

    _updateLocalStorage: function() {
        var notes = JSON.stringify(this.state.notes);
        localStorage.setItem('notes', notes);
    }
});

ReactDOM.render(
    <NotesApp />,
    document.getElementById('mount-point')
);