import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import * as ics from 'ics';
import * as file_saver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExportIcsService {

  constructor() { }
  // Generate A Single Member events Array
  exportIcsSingleUser(itemArray, itemTitle) {
    let eventsarray = [];
    itemArray.forEach((item) => {
      let events = {};
      events['title'] = "Emp-Abs-" + itemTitle + "-" + item.type;
      this.formatEventsArrayDate(events, item, eventsarray);
    });
    this.generateIcsFile(eventsarray);
  }

  // Generate Complete Absences Events Array
  exportIcsMultiUser(itemArray) {
    let eventsarray = [];
    itemArray.forEach((item) => {
      let events = {};
      events['title'] = "Emp-Abs-" + item.memberDetails.name + "-" + item.type;
      this.formatEventsArrayDate(events, item, eventsarray);
    });
    this.generateIcsFile(eventsarray);
  }

  // Generate Complete Members Absences Events Array
  exportIcsMultiLoop(itemArray) {
    let eventsarray = [];
    itemArray.forEach((parentitem) => {
      if (parentitem.absences) {
        parentitem.absences.forEach((childitem) => {
          let events = {};
          events['title'] = "Emp-Abs-" + parentitem.name + "-" + childitem.type;
          this.formatEventsArrayDate(events, childitem, eventsarray);
        });
      }
    });
    this.generateIcsFile(eventsarray);
  }

  // Format Events Array Dates
  formatEventsArrayDate(events, item, eventsarray) {
    events['start'] = item.startDate.split('-');
    let enddate = new Date(item.endDate);
    enddate.setDate(enddate.getDate() + 1);
    events['end'] = formatDate(enddate, 'y-M-d', 'en').split('-');
    eventsarray.push(events);
  }

  generateIcsFile(eventsarray) {
    // Generate events using ics
    const { error, value } = ics.createEvents(eventsarray);
    if (error) {
      console.log(error);
      return
    }
    let filename: string = "abscence-list" + Date.now() + ".ics";
    let blob: Blob = new Blob([value], { type: 'text/plain' });
    // Download ics file using file saver
    file_saver.saveAs(blob, filename);
  }
}
