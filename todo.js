const fs = require('fs');
const DATA_FILE = "./todo.txt";
const DATA_COMPLITED = "./done.txt";
class app  {
	constructor(filepath){
		this.path = filepath;
		if(!fs.existsSync(this.path)){
			let data = {
				tasks: [],
			}
			this.setData(data);
		}
	}

	list = () => {
	const data = this.getData();
	if(data.tasks.length > 0){
		let reverse = data.tasks.reverse();
		reverse.forEach(function (taskobj,index){
			if(!taskobj.completed){
				console.log(`[${reverse.length - index}] ${taskobj.task}`)
			}
		});
		
	}else{
		console.log("There are no pending todos!");
	}
	} 

	complited = (desFile,idToDel) => {
		let today = new Date();
		const dd = String(today.getDate()).padStart(2, '0');
		const mm = String(today.getMonth() + 1).padStart(2, '0');
		const yyyy = today.getFullYear();
		today = yyyy + '/' + mm + '/' + dd;

		const data = this.getData();
		let result = desFile.getData(); 
		let dataToAdd ;
		let flag = true;
			if(idToDel =='' || idToDel == undefined) {
				console.log("Error: Missing NUMBER for marking todo as done.");
			} 
			else if(idToDel == 0 || data.tasks.length < idToDel){
				console.log(`Error: todo #${idToDel} does not exist.`);
			}
			else if(data.tasks.length >= idToDel){
			 dataToAdd = data.tasks.splice(idToDel - 1,1);
			 result.tasks.push({task: `x ${today} ${dataToAdd[0].task}`,completed:true});
			 console.log("Marked todo #"+idToDel+" as done.");
			}
		this.setData(data);
		desFile.setData(result);	
   }

	del = (idToDel) => {
		const data = this.getData();
		    if(idToDel == '' || idToDel == undefined){
				console.log("Error: Missing NUMBER for deleting todo.");
			}else if(idToDel == 0 || data.tasks.length < idToDel){
				console.log(`Error: todo #${idToDel} does not exist. Nothing deleted.`);
			}		
			else if(data.tasks.length >= idToDel){
				data.tasks.splice(idToDel,1);
				console.log(`Deleted todo #${idToDel}`);
			}		
	
		this.setData(data);
	}

	getData = () =>{
		const content = fs.readFileSync(this.path);
		const data = JSON.parse(content);
		return data;
	}
	
	setData = (data) => {
		const content = JSON.stringify(data);
		fs.writeFileSync(this.path,content);
	}
	add = (task)=> {   
		if(task =='' || task == undefined)  console.log("Error: Missing todo string. Nothing added!");                             
		let data = this.getData();
		// let id;
		task.forEach( t => {

			data.tasks.push({task:`${t}`,completed:false});
			console.log(`Added todo: "${t}"`);
		});
		
		this.setData(data);
	}
}

const help = () => {
	const hlp = `
Usage :-
$ ./todo add "todo item"  # Add a new todo
$ ./todo ls               # Show remaining todos
$ ./todo del NUMBER       # Delete a todo
$ ./todo done NUMBER      # Complete a todo
$ ./todo help             # Show usage
$ ./todo report           # Statistics
`;
	console.log(hlp);
}

const init = () => { 
	dataFile = new app(DATA_FILE);
	complitedFile = new app(DATA_COMPLITED);
}

const report = () => {
	const d1 = dataFile.getData();
	const d2 = complitedFile.getData();
	let today = new Date();
		const dd = String(today.getDate()).padStart(2, '0');
		const mm = String(today.getMonth() + 1).padStart(2, '0');
		const yyyy = today.getFullYear();
		today = yyyy + '-' + mm + '-' + dd;
	    console.log(today,"Pending :",d1.tasks.length,"Completed :",d2.tasks.length);
}

init();
const command = process.argv[2];
const argument = process.argv[3];
const args = process.argv.length;
let arrArgs = [] ;
if(args > 3){
for(let i = 0;i<= args && process.argv[i + 3] != undefined; i++){
   arrArgs[i] = process.argv[i + 3];  	
}
}
switch(command){
	case "add":
		dataFile.add(arrArgs);
		break;
	case "help":
		help();
		break;
	case "del":
		dataFile.del(argument);
		break;
	case "ls":
		dataFile.list();
		break;
	case "done":
		dataFile.complited(complitedFile,argument);
		break;
	case "report":
		report();
		break;
	default:
		help();
		break;
}