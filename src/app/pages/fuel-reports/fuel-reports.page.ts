import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TripService } from 'src/app/services/trip.service';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingController } from '@ionic/angular';
import { ListsService } from 'src/app/services/lists.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-fuel-reports',
  templateUrl: './fuel-reports.page.html',
  styleUrls: ['./fuel-reports.page.scss'],
})
export class FuelReportsPage implements OnInit {
  headerImageUrl = '';
  filterForm: FormGroup;
  trailers = [];

  content = {
    content: [
      {
        columns: [
          {
            width: 'auto',
            bold: true,
            text: ['\nDriver names\n\n\n', 'Tractor Unit\n\n'],
          },
          {
            width: 'auto',
            bold: true,
            text: ['\nNDAWRE\nN DAWRE\n\n', '#205'],
          },
          {},
          {
            alignment: 'center',
            image: '',
            width: 110,
          },
          {},
          {
            alignment: 'right',
            width: 'auto',
            text: [
              '\n1/25/21\n\n',
              'Safe Speed Express Logistics Inc,\n',
              '435 N highview Ave, Elmhurst, IL 60126\n',
              '708 733 0303\n',
              'info@sselogistics.net\n\n',
            ],
          },
        ],
      },
      {
        style: 'tableExample',
        fontSize: 7,
        margin: [0, 10, 0, 5],
        table: null,
        layout: {
          defaultBorder: false,
          fillColor: function (rowIndex, node, columnIndex) {
            return rowIndex == 0
              ? '#4471c6'
              : rowIndex % 2 === 1
              ? '#dae0f3'
              : null;
          },
        },
      },
    ],
    defaultStyle: {
      columnGap: 25,
      fontSize: 9,
    },
    styles: {
      header: {
        bold: true,
      },
    },
  };

  constructor(
    private tripService: TripService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private loadingCtrl: LoadingController,
    private listService: ListsService,
    private toastService: ToastService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      startDate: new FormControl('', Validators.compose([Validators.required])),
      endDate: new FormControl('', Validators.compose([Validators.required])),
      unitNumber: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
    });
    this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
      loadingEl.present();
      this.listService.getAllCombos().subscribe(
        (res: any) => {
          this.trailers = res.trailers;
          loadingEl.dismiss();
        },
        (err) => {
          loadingEl.dismiss();
        }
      );
    });
  }

  generateReport() {
    console.log(this.filterForm.value.endDate);
    let endDate = moment(this.filterForm.value.endDate)
      .add('1', 'days')
      .format('YYYY-MM-DD');
    console.log(endDate);

    if (this.filterForm.valid) {
      if (this.headerImageUrl) {
        this.loadingCtrl
          .create({ keyboardClose: true, message: 'Checking datas ...' })
          .then((loadingEl) => {
            loadingEl.present();
            this.tripService
              .getAllTripsByDate(
                new Date(this.filterForm.value.startDate.split('T')[0]),
                new Date(endDate),
                this.filterForm.value.unitNumber
              )
              .subscribe(
                (res: any) => {
                  loadingEl.dismiss();
                  console.log(res);
                  if (res.length > 0) {
                    this.loadReport(res);
                  } else {
                    this.alertService.showAlert(
                      'Empty dtas',
                      'No any trips made by selected trailer in the selected time period',
                      ['Okay']
                    );
                  }
                },
                (err) => {
                  loadingEl.dismiss();
                  console.log(err);

                  this.alertService.showFirebaseAlert(err);
                }
              );
          });
      } else {
        this.toastService.presentToast('Please upload header image');
      }
    } else {
      this.toastService.presentToast('Please fill all the datas');
    }
  }

  loadReport(res) {
    let totalFuelCost = 0;
    let totalFuelAmount = 0;
    this.content.content[0].columns[5].text[0] =
      '\n' + moment(new Date()).format('MM/DD/YYYY') + '\n\n';
    let table = {
      heights: 7,
      headerRows: 1,
      color: '#ffffff',
      widths: ['*', '*', '*', '*'],
      body: [
        [
          {
            text: 'DATE',
            color: '#ffffff',
          },
          {
            text: 'STATE',
            color: '#ffffff',
          },
          {
            text: 'AMOUNT',
            color: '#ffffff',
          },
          {
            text: 'COST',
            color: '#ffffff',
          },
        ],
        [{}, {}, {}, {}],
        [{}, {}, {}, {}],
      ],
    };

    this.content.content[1].table = table;
    res.forEach((trip) => {
      trip.fuelFillings.forEach((fuel) => {
        let data = [
          moment(fuel.addedDate).format('MM/DD/YYYY'),
          fuel.state,
          fuel.amount,
          '$ ' + fuel.cost,
        ];
        totalFuelAmount = totalFuelAmount + parseInt(fuel.amount);
        totalFuelCost = totalFuelCost + parseInt(fuel.cost);
        this.content.content[1].table.body.push(data);
        this.content.content[1].table.body.push([{}, {}, {}, {}]);
      });
    });
    this.content.content[1].table.body.push([
      { style: 'header', text: 'TOTAL' },
      { style: 'header', text: '' },
      { style: 'header', text: totalFuelAmount },
      { style: 'header', text: '$ ' + totalFuelCost },
    ]);
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Loading datas ...' })
      .then((loadingEl) => {
        loadingEl.present();
        this.userService.getUserDetailsById(res[0].addedBy).subscribe(
          (resp) => {
            this.content.content[0].columns[1].text = [
              '\n' + resp.name + '\n' + res[0].teamMate + '\n\n',
              '#' + res[0].unitNumber,
            ];
            var dd = this.content;
            loadingEl.dismiss();
            pdfMake.createPdf(dd).open();
          },
          (err) => {
            loadingEl.dismiss();
            this.alertService.showFirebaseAlert(err);
          }
        );
      });
  }

  loadImageFromDevice(event) {
    let verifyUpload = event.target.files.length;
    console.log(event);

    let uploadedFile = event.target.files[0];
    const reader = new FileReader();

    reader.readAsArrayBuffer(uploadedFile);

    reader.onload = async () => {
      var base64data: any = reader.result;
      this.headerImageUrl = base64data;
      this.content.content[0].columns[3].image = base64data;
    };
  }
  getCost(res: any) {
    let totalCost = 0;
    res.forEach((item) => {
      totalCost = totalCost + parseInt(item.cost);
    });
    return totalCost;
  }
}
