import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { Visit } from './visit.model';
import { VisitService } from './visit.service';

@Component({
    selector: 'jhi-visit-detail',
    templateUrl: './visit-detail.component.html'
})
export class VisitDetailComponent implements OnInit, OnDestroy {

    visit: Visit;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private visitService: VisitService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInVisits();
    }

    load(id) {
        this.visitService.find(id).subscribe((visit) => {
            this.visit = visit;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInVisits() {
        this.eventSubscriber = this.eventManager.subscribe(
            'visitListModification',
            (response) => this.load(this.visit.id)
        );
    }
}
