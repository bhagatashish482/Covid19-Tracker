import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { GoogleChartInterface } from 'ng2-google-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  totalConfirmed = 0;
  totalActive = 0;
  totaldeaths = 0;
  totalRecovered = 0;
  loading = true;
  pieChart : GoogleChartInterface = {
    chartType: 'PieChart'
  }
  columnChart : GoogleChartInterface = {
    chartType: 'ColumnChart'
  }

  globalData : GlobalDataSummary[]; 

  constructor( private dataService : DataServiceService) { }

  initChart(caseType:string){

    console.log(caseType);
    

    let dataTable = [];
    dataTable.push(["Country", "Cases"])

    this.globalData.forEach(cs=>{
      let value :number;

      if(caseType == 'c'){
        if(cs.confirmed>100){
          console.log("in confirmed");
          
          value=cs.confirmed
        }
      }
        
      if(caseType == 'a'){
        if(cs.active>100){
          console.log("in active");
          value=cs.active
        }
      }
        
      if(caseType == 'r'){
        if(cs.recovered>100){
          console.log("in recovered");
          value=cs.recovered
        }
      }
        

      if(caseType == 'd'){
        if(cs.deaths>100){
          console.log("in deaths");
          value=cs.deaths
        }
      }

      dataTable.push([
        cs.country ,value
      ])

      // switch(caseType){
      //   case 'c' : {
      //     if(cs.confirmed>100){
      //       value=cs.confirmed
      //       dataTable.push
      //     }
      //     break;
      //   }
      //   case 'a' : {
      //     if(cs.active>100){
      //       value=cs.active
      //     }
      //     break;
      //   }
      //   case 'r' : {
      //     if(cs.recovered>100){
      //       value=cs.recovered
      //     }
      //     break;
      //   }
      //   case 'd' : {
      //     if(cs.deaths>100){
      //       value=cs.deaths
      //     }
      //     break;
      //   }
      //   default:{
      //     console.log("select Cae Type");
      //     break;
      //   }

      // }
      

    })
    
    this.pieChart ={
      chartType : 'PieChart',
      dataTable: dataTable,
      options : { 
        height : 500,
        animations:{
          duration: 10000,
          easing: 'out',
        },
      },
    }; 

    this.columnChart ={

      chartType : 'ColumnChart',
      dataTable: dataTable,
      options : { 
        height : 500,
        animations:{
          duration: 10000,
          easing: 'out',
        },
      },
    };

    
  }

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe(
      {
        next : (result)=>{
          console.log(result);
          this.globalData = result;

          result.forEach(cs=>{
            if(!Number.isNaN(cs.confirmed)){
              this.totalRecovered += cs.recovered
              this.totalConfirmed += cs.confirmed
              this.totaldeaths += cs.deaths
              this.totalActive += cs.active
            }
             
          })

          this.initChart('c'); 
        },
        complete : ()=>{
          this.loading = false;
        }
      }
    )
  }

  updateChart(input: HTMLInputElement){
    //console.log(input.value);
    this.initChart(input.value);
  }

}
