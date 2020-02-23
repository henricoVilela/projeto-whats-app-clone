export class ClassEvent{

    constructor(){
        this._events = {};
    }

    on(eventName, fn){
        if(!this._events[eventName]){
            this._events[eventName] = new Array();
        }
        this._events[eventName].push(fn);
    }//on

    trigger(){
        let args = [...arguments];

        //remove o primeiro elemento do array e retorna ele
        let eventName = args.shift();
        args.push(new Event(eventName));
        if(this._events[eventName] instanceof Array){
            this._events[eventName].forEach(fn => {
                fn.apply(null, args);
            });
        }
    }//trigger
}