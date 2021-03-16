import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Restaurant } from './restaurant.model';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

    /*URL for coding challenge*/
    URL = 'https://code-challenge.spectrumtoolbox.com/api/restaurants';
    headerDict = new HttpHeaders({Authorization: "Api-Key q3MNxtfep8Gt"});

    constructor(
        private httpClient: HttpClient
    ) { }

    /**
     * Get a list of restaurants based on the restaurant model object
     */
    getRestaurants(): Observable<Restaurant[]> {
        return this.httpClient.get<Restaurant[]>(this.URL, {headers: this.headerDict});
    }

    /**
     * Function to sort restaurants on some given field
     * @param restList list of restaurants to be sorted
     * @param fieldName the field on which to sort the restaurants
     */
    sortList(restList: Restaurant[], fieldName: string): Restaurant[] {
        if (restList.length < 1 || !Array(restList)) {
            // just return the empty list
            return restList;
        }
        const tempList = [...restList];
        // do a bubble sort
        for (let i = 0; i < tempList.length - 1; i++) {
            for (let x = 0; x < tempList.length - 1; x++) {
                // we know that all names have a value, otherwise we handle undefined case here
                if (tempList[x].get(fieldName) > tempList[x+1].get(fieldName)){
                    const greaterValue = tempList[x];
                    tempList[x] = tempList[x+1];
                    tempList[x+1] = greaterValue;
                }
            }
        }
        return tempList;
    }

    /**
     * Filters the given list given a list of fields and a filter string
     * @param restList the list of restaurants to be filtered
     * @param fieldNames the list fields to filter
     * @param filterVal the value of the filter
     */
    filterList(restList: Restaurant[], fieldNames: string[], filterVal: string) {

        if (restList.length < 1 || !Array(restList)) {
            // just return the empty list
            return restList;
        }
        const tempList = [];

        for (const restItem of restList) {
            for (const fieldName of fieldNames) {
                // Filter is inclusive rather than exclusive
                if (restItem.get(fieldName).toLocaleLowerCase().includes(filterVal.toLocaleLowerCase())) {
                    tempList.push(restItem);
                    //only add each item once
                    break;
                }
            }
        }
        return tempList;
    }
    
    /**
     * Returns a set of sorted values for a specific field from array of restaurants
     * @param restList the array of restaurants
     * @param fieldName the field name to consolidate array
     */
    arrToSet(restList: Restaurant[], fieldName: string) {
        const tempSet = new Set();
        // sort list so that the resulting drop down array is already sorted
        const tempList = this.sortList(restList, fieldName);

        // add value of specified field to set
        for (const restItem of tempList) {
            tempSet.add(restItem.get(fieldName));
        }
        return tempSet;
    }
}
