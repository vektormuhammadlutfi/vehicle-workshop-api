import { Context as HonoContext } from 'hono';

export interface CustomContext {
    userId: number;
}

export type Context = HonoContext & {
    set: <K extends keyof CustomContext>(key: K, value: CustomContext[K]) => void;
    get: <K extends keyof CustomContext>(key: K) => CustomContext[K];
};

export enum CsvJobStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}

export interface WorkOrderReportParams {
    startDate: string;
    endDate: string;
}

export interface WorkOrder {
    Oid: string;
    WorkOrderNo: string;
    WorkOrderDate: string;
    BookingNo: string;
    Branch: string;
    WorkOrderStatus: string;
    ServiceAdvisor: string;
    TotalPartWithholdingTax: string;
    VehicleUnit: string;
    RepairType: string;
    DamageCategory: string;
    ServiceStartOn: string;
    GrossJobSales: string;
    GrossPartSales: string;
    TotalPartDiscount: string;
    TotalPartProgram: string;
    TotalPartVAT: string;
    TotalJobDiscount: string;
    TotalJobProgram: string;
    TotalJobVAT: string;
    TotalJob: string;
    TotalPart: string;
    TotalInvoice: string;
    RepairSubType: string;
    SPKReference: string;
    ServiceAdvisorName: string;
    LicensePlateNumber: string;
    FrameSerialNo: string;
    EngineSerialNo: string;
    VehicleDeliveryDate: string;
    Color: string;
    VehicleModel: string;
    VehicleFullModelName: string;
    Customer: string;
    Street: string;
    CustomerMobileNo: string;
    IdentificationNo: string;
    Province: string;
    City: string;
    District: string;
    CustomerType: string;
    ContactPersonName: string | null;
    ContactPersonMobileNo: string | null;
    RepairTypeDescription: string;
    BranchName: string;
    VehicleModelName: string;
    BrandName: string;
    DealerName: string;
    DealerType: string;
    MobileServiceType: string | null;
}