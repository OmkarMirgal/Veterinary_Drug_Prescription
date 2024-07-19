export interface IPrescriptionData {
    id: number;
    indication: string;
    diagnosisDetails: string;
    application: string;
    amount: number;
    amountUnit: string;
    dosage: number;
    applicationDate: string;
    applicationDuration: number;
    usageDuration: number;
    usageInstructions: string;
    stable_id: number;
    created_at: string;
    updated_at: string;
}

export interface ICreatePrescription {
    stable_id: number;
    indication: string;
    diagnosisDetails: string;
    application: string;
    amount: number;
    amountUnit: string;
    dosage: number;
    applicationDate: string;
    applicationDuration: number;
    usageDuration: number;
    usageInstructions: string;
}