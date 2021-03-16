import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'restaurant-project';

    /*URL for coding challenge*/
    URL = 'https://code-challenge.spectrumtoolbox.com/api/restaurants';

    restaurantData = <any>[];
    headerDict = new HttpHeaders({Authorization: "Api-Key q3MNxtfep8Gt"});

    constructor(
        private http: HttpClient,
    ) { }


    ngOnInit() {
        this.http.get<any[]>(this.URL, {headers: this.headerDict}).subscribe((data: any[]) => {
            this.restaurantData = data;
        });
        console.log(this.restaurantData);
    }
}
