import {
  ExpenseService,
  InvestService,
  LoanService,
  MonthlyLimitService,
  UserService,
} from '@trackingPortal/api/implementations';
import {TrackingWalletConfig} from '@trackingPortal/api/TrackingWalletConfig';
import {AxiosAjaxUtils} from '@trackingPortal/api/utils/AxiosAjaxUtils';
import {IApiGateWay} from '@trackingPortal/api/interfaces';
import {URLString} from '@trackingPortal/api/primitives';
import {REST_API_BASE_URL} from '@env';

export class ApiGateway implements IApiGateWay {
  public config: TrackingWalletConfig;
  public ajaxUtils: AxiosAjaxUtils;
  public userService: UserService;
  public expenseService: ExpenseService;
  public monthlyLimitService: MonthlyLimitService;
  public loanServices: LoanService;
  public investService: InvestService;

  constructor() {
    this.config = new TrackingWalletConfig(
      URLString(REST_API_BASE_URL as URLString),
    );
    this.ajaxUtils = new AxiosAjaxUtils();

    this.userService = new UserService(this.config, this.ajaxUtils);
    this.expenseService = new ExpenseService(this.config, this.ajaxUtils);
    this.monthlyLimitService = new MonthlyLimitService(
      this.config,
      this.ajaxUtils,
    );
    this.loanServices = new LoanService(this.config, this.ajaxUtils);
    this.investService = new InvestService(this.config, this.ajaxUtils);
  }
}
