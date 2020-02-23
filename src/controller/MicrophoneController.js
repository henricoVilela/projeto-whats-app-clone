import { ClassEvent } from "../util/ClassEvent";

export class MicrophoneController extends ClassEvent{

    constructor(){

        super();

        this._available = false;
        this._mimeType = 'audio/webm';

        //pede permisão do usuario para acessar o driver de audio
        navigator.mediaDevices.getUserMedia({audio: true}).then(stream=>{
            this._available = true;
            this._stream = stream;

            /*let audio = new Audio();
            audio.srcObject = stream
            audio.play();*/

            this.trigger('ready',this._stream);
            
        }).catch(err=>{
            this._available = false;
            console.error(err)
        });
    }

    isAvailable(){
        return this._available;
    }//isAvailable

    stop(){
        this._stream.getTracks().forEach(track => {
            track.stop();
        });
    }//stop

    startRecord(){
        if (this.isAvailable()){
            this._mediaRecorder  = new MediaRecorder(this._stream, {
                mimeType: this._mimeType
            });
            this._recordedChunks = [];//vamos usar esse atributo para guarda os fragmentos de audio gravado

            this._mediaRecorder.addEventListener('dataavailable', e =>{

                if (e.data.size > 0){
                    this._recordedChunks.push(e.data);
                }

            });

            this._mediaRecorder.addEventListener('stop', e =>{

                //convert o array com os fragmentos gravados em um blob
                let blob = new Blob(this._recordedChunks,{
                    type: this._mimeType
                });

                let fileName = `rec${Date.now()}.webm`;

                //Cria o arquivo final de audio
                let file = new File([blob], fileName, {
                    type: this._mimeType,
                    lastModified: Date.now()
                });

                console.log('file',file);

            });

            this._mediaRecorder.start();
            this.startTimer();
        }
    }//startRecord

    stopRecord(){
        if (this._available){
            this._mediaRecorder.stop();
            this.stop();
            this.stopTimer();
        }
    }//stopRecord

    startTimer(){
        let start = Date.now();

        this._recordMicrophoneInterval = setInterval(()=>{

            this.trigger('recordtimer',(Date.now() - start));

        },100);
    }//startTimer

    stopTimer(){
        //parar o timer
        clearInterval(this._recordMicrophoneInterval);
    }//stopTimer
}