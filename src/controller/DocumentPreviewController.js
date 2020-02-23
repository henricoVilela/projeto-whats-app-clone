const pdfjsDist = require('pdfjs-dist');
const path = require('path');

pdfjsDist.GlobalWorkerOptions.workerSrc = path.resolve(__dirname,'../../dist/pdf.worker.bundle.js');

export class DocumentPreviewController{
    
    constructor(file){
        this._file = file
    }
 
    getPreviewData(){
        return new Promise((resolve,reject)=>{
            let reader = new FileReader();
            switch (this._file.type) {
                case 'image/png':
                case 'image/jpeg':
                case 'image/jpg':
                case 'image/gif':
                    
                    //sucesso 
                    reader.onload  = (e)=>{
                        resolve({
                            src: reader.result,
                            info: this._file.name
                        });
                    };
                    //falha
                    reader.onerror = (err)=>{
                        reject(err);
                    };

                    reader.readAsDataURL(this._file);
                break;

                case 'application/pdf':
                    
                    reader.onload = (e) =>{
                        //Ler o documento pdf
                        let array8bit = new Uint8Array(reader.result);

                        pdfjsDist.getDocument(array8bit).then(pdf =>{
                            //Pega uma pagina desse pdf
                            pdf.getPage(1).then(page =>{

                                let viewport = page.getViewport(1);
                                let canvas   = document.createElement('canvas');
                                let canvasContext  = canvas.getContext('2d'); 

                                canvas.width  = viewport.width
                                canvas.height = viewport.height
                                //console.log(page,pdf);
                                
                                page.render({
                                    canvasContext,
                                    viewport
                                }).then(()=>{

                                    let s = (pdf.numPages > 1) ? 's' : '';
                                    resolve({
                                        src: canvas.toDataURL('image/png'),
                                        info: `${pdf.numPages} Página${s}`
                                    });

                                }).catch(err =>{
                                    reject(err);
                                });

                            }).catch(err =>{
                               reject(err);
                            });

                        }).catch(err=>{
                            reject(err);
                        });
                    };

                    reader.readAsArrayBuffer(this._file);
                break;
                default:
                    reject();
            }
        });
    }
}