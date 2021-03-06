import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Restaurant } from '../shared/restaurant.model';
import { RestaurantService } from '../shared/restaurant.service';

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.css']
})
export class RestaurantListComponent implements OnInit {
    private ngUnsubscribe = new Subject();
    
    /**The list of restaurants filtered */
    workingRestaurantList: Restaurant[];

    /**The list of restaurants visible on the page */
    workingRestaurantListVisible: Restaurant[];

    /**The list of all restaurants gathered at page load */
    restaurantData: Restaurant[];

    /**The drop down of states */
    stateSet = new Set();

    /**The drop down of genres */
    genreSet = new Set();

    /**The currently selected genre */
    genreFilter = "all";

    /**The currently selected state */
    stateFilter = "all";

    /**The text of the search filter */
    searchFilter = "";

    /** Page start and end indeces */
    pageStart = 0;
    pageEnd = 10;
    workingListSize = 0;

    constructor(
        private restaurantService: RestaurantService
    ) {
        this.workingRestaurantList = [];
        this.workingRestaurantListVisible = [];
        this.restaurantData = [];
    }
    
    ngOnInit(): void {
        this.restaurantService.getRestaurants().pipe(takeUntil(this.ngUnsubscribe)).subscribe((pojos) => {
            const arr = [];
            for (const p of pojos) {
                arr.push(Restaurant.fromJson(p));
            }
            // We only need to sort once
            this.restaurantData = this.restaurantService.sortList(<Restaurant[]>arr, "name");
            this.workingListSize = this.restaurantData.length;

            // The first call just fills the dropdowns
            this.updateListAndDropdowns(this.restaurantData, this.searchFilter, this.stateFilter, this.genreFilter);
        });
    }

    
    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
    
    /**
     * Update filters after keydown event
     * @param event The last key typed into the search box
     */
    keydown(event: KeyboardEvent) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.searchFilter = filterValue;
        if (
                event.key === "Enter" ||
                (
                    filterValue === "" && 
                    (
                        event.key === "Delete" || 
                        event.key === "Backspace"
                    )
                )
        ) {
            this.updateListAndDropdowns(this.restaurantData, filterValue, this.stateFilter, this.genreFilter);
        }
        if (filterValue === "" && (event.key === "Delete" || event.key === "Backspace")) {
            this.updateListAndDropdowns(this.restaurantData, filterValue, this.stateFilter, this.genreFilter);
        }
    }

    /**
     * Update filters after select change
     * @param $event the event triggered by a a select value change
     * @param fieldName the field name to filter on
     */
    onSelectChange($event : Event, fieldName: string) {
        const selectedValue = ($event.target as HTMLInputElement).value
        if (fieldName === "state") {
            this.stateFilter = selectedValue;
            this.updateListAndDropdowns(this.restaurantData, this.searchFilter, selectedValue, this.genreFilter);
        } else if (fieldName === "genre") {
            this.genreFilter = selectedValue;
            this.updateListAndDropdowns(this.restaurantData, this.searchFilter, this.stateFilter, selectedValue);
        }
    }

    /**
     * A function to change page based on button clicks
     * @param $event The event triggered by clicking the back and forward buttons
     */
    onPageChange($event : Event) {
        const pageChangeValue = ($event.target as HTMLInputElement).value;
        if (pageChangeValue === "forward" && this.workingRestaurantList.length > this.pageEnd) {
            this.pageStart += 10;
            this.pageEnd += 10;
        } else if (pageChangeValue === "back" && this.pageEnd > 0) {
            this.pageStart -= 10;
            this.pageEnd -= 10;
        }
        this.updateListAndDropdowns(this.restaurantData, this.searchFilter, this.stateFilter, this.genreFilter);
    }

    /**
     * Update all filters based on two dropdowns and input
     * @param restList the list of data to be filtered
     * @param searchFilter the search box filter value
     * @param stateFilter the state filter value
     * @param genreFilter the genre filter value
     */
    updateListAndDropdowns(restList: Restaurant[], searchFilter: string, stateFilter : string, genreFilter: string) {
        let tempList = [...restList];
        if (stateFilter !== "all") {
            tempList = this.restaurantService.filterList(tempList, ['state'], stateFilter);
        }
        if (genreFilter !== "all") {
            tempList = this.restaurantService.filterList(tempList, ['genre'], genreFilter);
        }
        if (searchFilter !== "") {
            tempList = this.restaurantService.filterList(tempList, ['name', 'state', 'genre'], searchFilter);
        }
        this.workingRestaurantList = tempList;
        if (this.workingListSize !== tempList.length) {
            this.pageStart = 0;
            this.pageEnd = 10;
        }
        this.workingRestaurantListVisible = tempList.slice(this.pageStart, this.pageEnd);
        this.stateSet = this.restaurantService.arrToSet(tempList, "state");
        this.genreSet = this.restaurantService.arrToSet(tempList, "genre");
    }
}
