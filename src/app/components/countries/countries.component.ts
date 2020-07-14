import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DateWiseData } from 'src/app/models/date-wise-data';
import { GoogleChartInterface } from 'ng2-google-charts';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  totalConfirmed = 0;
  totalActive = 0;
  totaldeaths = 0;
  totalRecovered = 0;
  selectedCountryDate : DateWiseData[];
  data : GlobalDataSummary[];
  countries : string[] = [];
  dateWiseDate;
  loading = true;
  lineChart : GoogleChartInterface = {
    chartType : 'LineChart'
  };

  constructor( private dataService : DataServiceService) { }

  ngOnInit(): void {

    merge(
      this.dataService.getDateWiseData().pipe(
        map(result=>{
          this.dateWiseDate = result;
        })
      ),
      this.dataService.getGlobalData().pipe(map(result=>{
        this.data = result;
        this.data.forEach(cs => {
          this.countries.push(cs.country)
        })
      }))
    ).subscribe({
      complete : ()=>{
        this.updateValues('India')
        this.loading = false;
      }
    })
  }

  updateChart(){
    let dataTable= [];
    dataTable.push(['Date', 'Cases'])
    this.selectedCountryDate.forEach(cs =>{
      dataTable.push([cs.date, cs.cases])
    })

    this.lineChart ={
      chartType: 'LineChart',
      dataTable: dataTable,
      options:{
        height : 500,
        animations:{
          duration: 10000,
          easing: 'out',
        },
      },
    };
  }

  updateValues(country : string){
    console.log(country);

    this.data.forEach(cs=>{
      if(cs.country == country){
        this.totalActive = cs.active
        this.totalConfirmed = cs.confirmed
        this.totalRecovered = cs.recovered
        this.totaldeaths = cs.deaths
      }
    })
    this.selectedCountryDate = this.dateWiseDate[country]
    //console.log(this.selectedCountryDate);
    this.updateChart();
  }

}
