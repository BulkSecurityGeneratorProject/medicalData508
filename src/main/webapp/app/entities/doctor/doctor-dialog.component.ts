import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Doctor } from './doctor.model';
import { DoctorPopupService } from './doctor-popup.service';
import { DoctorService } from './doctor.service';

@Component({
    selector: 'jhi-doctor-dialog',
    templateUrl: './doctor-dialog.component.html'
})
export class DoctorDialogComponent implements OnInit {

    doctor: Doctor;
    isSaving: boolean;
    birthdateDp: any;
    startDateDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private doctorService: DoctorService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.doctor.id !== undefined) {
            this.subscribeToSaveResponse(
                this.doctorService.update(this.doctor));
        } else {
            this.subscribeToSaveResponse(
                this.doctorService.create(this.doctor));
        }
    }

    private subscribeToSaveResponse(result: Observable<Doctor>) {
        result.subscribe((res: Doctor) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Doctor) {
        this.eventManager.broadcast({ name: 'doctorListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }
}

@Component({
    selector: 'jhi-doctor-popup',
    template: ''
})
export class DoctorPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private doctorPopupService: DoctorPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.doctorPopupService
                    .open(DoctorDialogComponent as Component, params['id']);
            } else {
                this.doctorPopupService
                    .open(DoctorDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
