/// <reference path="../../../../typings/angular2/angular2.d.ts" />
import {Component, View, NgFor, NgIf} from 'angular2/angular2';
import {Appointments} from '../views/appointments';
import {AuthenticationService} from '../../services/authenticationservice';
import {AppointmentsService} from '../../services/appointmentsservice';
import {CalendarService} from '../../services/calendarService';
import { _settings } from '../../settings';

@Component({
    selector: 'calendars'
})
@View({
	templateUrl: _settings.buildPath +'/components/views/calendars.html',	
	directives: [NgFor, NgIf, Appointments]
})

export class Calendars{
    calendarlist: Array<Object>;
    appointments: Array<string>;	
	calendarid: string;
    calendar: string;
    authenticationService: AuthenticationService;
    calendarService: CalendarService;
    appointmentService: AppointmentsService;

    constructor(authenticationService: AuthenticationService, calendarService: CalendarService, appointmentService: AppointmentsService){
        this.calendarlist = [{summary: 'Please refresh view', id: 'none'}];
        this.appointments = ['Please select calendar'];
        this.authenticationService = authenticationService;
        this.appointmentService = appointmentService;
        this.calendarService = calendarService;
    }    

    refreshAppointments() {
		/*
		 * loading the appointments is done asychronously. the service's loadAppointments() method
		 * returns a Promise that provides access to the newly loaded set of appointments. Updating
		 * the array of appointments triggers angular's one-way-binding between the field and the 
		 * widget.
		 */		
		this.calendarService.loadCalendarlists().then((newcalendars) => {			
			// clean the array of existing calendars
			this.calendarlist.splice(0, this.calendarlist.length);
			// copy all new items to the array of existing calendars
			this.calendarlist.push.apply(this.calendarlist, newcalendars);
			console.log('displaying ' + this.calendarlist.length + ' calendars')
		});		
	}

    selectcalendar(calendar){
		this.calendarid = calendar.id;
        this.calendar = calendar.summary;
		console.log(this.calendarid);
		this.appointmentService.loadAppointments(this.calendarid).then((newAppointments) => {
			// clean the array of existing appointments			
			this.appointments.splice(0, this.appointments.length);
			// copy all new items to the array of existing appointments
			this.appointments.push.apply(this.appointments, newAppointments);
			console.log('displaying ' + this.appointments.length + ' appointments')
		});
	}

}