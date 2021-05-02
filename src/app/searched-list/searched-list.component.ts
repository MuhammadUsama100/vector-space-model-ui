import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-searched-list',
  templateUrl: './searched-list.component.html',
  styleUrls: ['./searched-list.component.scss']
})
export class SearchedListComponent implements OnInit {
  public items :any[] = []
  public query : any 
  public resultDoc = "" 
  public  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };
  constructor(private route: ActivatedRoute,
   private http: HttpClient , private formBuilder: FormBuilder , private router: Router) { }

   
  checkoutForm = this.formBuilder.group({
    query: '',
  });
  ngOnInit(): void {
    this.query  =  this.route.snapshot.paramMap.get("query");
    console.log(this.query)
    
    this.http.post<Result>("http://127.0.0.1:5000/process-query" , {"query":  this.query} , {headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })}).subscribe(data => {
     let list = data.resultset["result-doc-set"]
     this.resultDoc  = String(list)
      let value = data.resultset["result-set"]

      for (let key in data.resultset["result-set"]){
        var val =  data["resultset"]
        let i = Object.keys(data.resultset["result-set"][key])[0]
        console.log(i)
        this.http.get(`assets/ShortStories/${Object.keys(data.resultset["result-set"][key])[0]}.txt` ,  {responseType: 'text'}).subscribe(data => {
          this.items.push( {header :  data.split("\n")[0]   , body: data.trim().substring(0,500).trim(), location: `${Object.keys(val["result-set"][key])[0]}`, score: val["result-set"][key][Object.keys(val["result-set"][key])[0]] , id:Object.keys(val["result-set"][key])[0] })
      })
      }
    
  })
    
   
  }
  onSubmit(data : any){
    console.log(data)
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate ( [ '/searched-list', data["query"].trim() ]);
  }
  open(data: any ){
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate ( [ '/result-view', data ]);
  }
}

class Result {
  public resultset : any 
}