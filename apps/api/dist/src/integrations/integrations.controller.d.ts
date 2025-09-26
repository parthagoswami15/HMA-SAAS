import { IntegrationsService } from './integrations.service';
import { FhirService } from './services/fhir.service';
import { Hl7Service } from './services/hl7.service';
import { PacsService } from './services/pacs.service';
import { LisService } from './services/lis.service';
import { PaymentGatewayService } from './services/payment-gateway.service';
import { GstService } from './services/gst.service';
import { AccountingService } from './services/accounting.service';
import { WebhookService } from './services/webhook.service';
import { ApiKeyService } from './services/api-key.service';
export declare class IntegrationsController {
    private readonly integrationsService;
    private readonly fhirService;
    private readonly hl7Service;
    private readonly pacsService;
    private readonly lisService;
    private readonly paymentGatewayService;
    private readonly gstService;
    private readonly accountingService;
    private readonly webhookService;
    private readonly apiKeyService;
    constructor(integrationsService: IntegrationsService, fhirService: FhirService, hl7Service: Hl7Service, pacsService: PacsService, lisService: LisService, paymentGatewayService: PaymentGatewayService, gstService: GstService, accountingService: AccountingService, webhookService: WebhookService, apiKeyService: ApiKeyService);
    getFhirPatient(patientId: string, req: any): Promise<{
        resourceType: string;
        id: any;
        identifier: {
            system: string;
            value: any;
        }[];
        name: {
            use: string;
            family: any;
            given: any[];
        }[];
        telecom: {
            system: string;
            value: any;
            use: string;
        }[];
        gender: any;
        birthDate: any;
        address: {
            use: string;
            line: any[];
            city: any;
            state: any;
            postalCode: any;
            country: string;
        }[];
        managingOrganization: {
            reference: string;
        };
    }>;
    createFhirPatient(patientDto: any, req: any): Promise<{
        resourceType: string;
        id: any;
        identifier: {
            system: string;
            value: any;
        }[];
        name: {
            use: string;
            family: any;
            given: any[];
        }[];
        telecom: {
            system: string;
            value: any;
            use: string;
        }[];
        gender: any;
        birthDate: any;
        address: {
            use: string;
            line: any[];
            city: any;
            state: any;
            postalCode: any;
            country: string;
        }[];
        managingOrganization: {
            reference: string;
        };
    }>;
    updateFhirPatient(patientId: string, patientDto: any, req: any): Promise<{
        resourceType: string;
        id: any;
        identifier: {
            system: string;
            value: any;
        }[];
        name: {
            use: string;
            family: any;
            given: any[];
        }[];
        telecom: {
            system: string;
            value: any;
            use: string;
        }[];
        gender: any;
        birthDate: any;
        address: {
            use: string;
            line: any[];
            city: any;
            state: any;
            postalCode: any;
            country: string;
        }[];
        managingOrganization: {
            reference: string;
        };
    }>;
    getFhirEncounter(encounterId: string, req: any): Promise<{
        resourceType: string;
        id: any;
        identifier: {
            system: string;
            value: any;
        }[];
        status: string;
        class: {
            system: string;
            code: string;
            display: string;
        };
        type: {
            coding: {
                system: string;
                code: string;
                display: any;
            }[];
        }[];
        subject: {
            reference: string;
            display: any;
        };
        participant: {
            type: {
                coding: {
                    system: string;
                    code: string;
                    display: string;
                }[];
            }[];
            individual: {
                reference: string;
                display: any;
            };
        }[];
        period: {
            start: any;
            end: any;
        };
        serviceProvider: {
            reference: string;
        };
    }>;
    createFhirObservation(observationDto: any, req: any): Promise<{
        resourceType: string;
        id: any;
        status: any;
        category: {
            coding: {
                system: string;
                code: any;
                display: any;
            }[];
        }[];
        code: {
            coding: {
                system: string;
                code: any;
                display: any;
            }[];
            text: any;
        };
        subject: {
            reference: string;
        };
        effectiveDateTime: any;
        valueQuantity: {
            value: any;
            unit: any;
            system: string;
            code: any;
        } | undefined;
        valueString: any;
        valueCodeableConcept: any;
        interpretation: {
            coding: {
                system: string;
                code: any;
            }[];
        }[] | undefined;
        note: {
            text: any;
        }[] | undefined;
    }>;
    getFhirObservation(observationId: string, req: any): Promise<{
        resourceType: string;
        id: any;
        status: any;
        category: {
            coding: {
                system: string;
                code: any;
                display: any;
            }[];
        }[];
        code: {
            coding: {
                system: string;
                code: any;
                display: any;
            }[];
            text: any;
        };
        subject: {
            reference: string;
        };
        effectiveDateTime: any;
        valueQuantity: {
            value: any;
            unit: any;
            system: string;
            code: any;
        } | undefined;
        valueString: any;
        valueCodeableConcept: any;
        interpretation: {
            coding: {
                system: string;
                code: any;
            }[];
        }[] | undefined;
        note: {
            text: any;
        }[] | undefined;
    }>;
    processHl7Message(hl7Dto: any, req: any): Promise<{
        messageId: any;
        messageType: any;
        status: string;
        result: {
            admissionId: any;
            patientId: any;
        } | {
            patientId: any;
            observationCount: number;
            observations: any[];
        } | {
            orderId: any;
            patientId: any;
        };
    }>;
    getHl7Message(messageId: string, req: any): Promise<{
        id: any;
        messageType: any;
        messageContent: any;
        sourceSystem: any;
        processedAt: any;
        status: any;
    }>;
    processAdmitMessage(admitDto: any, req: any): Promise<{
        admissionId: any;
        patientId: any;
    }>;
    processDischargeMessage(dischargeDto: any, req: any): Promise<{
        admissionId: any;
        patientId: any;
    }>;
    uploadStudy(studyDto: any, req: any): Promise<{
        studyId: any;
        studyInstanceUid: any;
        status: string;
    }>;
    getStudy(studyId: string, req: any): Promise<{
        studyId: any;
        patient: any;
        studyInstanceUid: any;
        modality: any;
        studyDescription: any;
        studyDate: any;
        studyTime: any;
        status: any;
        reports: any;
        metadata: any;
    }>;
    getPatientStudies(patientId: string, req: any): Promise<any>;
    addStudyReport(studyId: string, reportDto: any, req: any): Promise<{
        reportId: any;
        studyId: string;
        status: string;
    }>;
    createLabOrder(orderDto: any, req: any): Promise<{
        orderId: any;
        status: string;
        message: string;
    }>;
    getLabOrder(orderId: string, req: any): Promise<any>;
    updateLabResult(orderId: string, resultDto: any, req: any): Promise<{
        resultId: any;
        orderId: string;
        testId: any;
        status: any;
    }>;
    getPatientLabOrders(patientId: string, req: any): Promise<any>;
    processPayment(paymentDto: any, req: any): Promise<{
        paymentId: any;
        amount: any;
        status: string;
        reference: string;
    }>;
    getPaymentStatus(paymentId: string, req: any): Promise<{
        paymentId: string;
        amount: any;
        currency: any;
        paymentMethod: any;
        status: any;
        processedAt: any;
        gatewayResponse: any;
    }>;
    processRefund(refundDto: any, req: any): Promise<{
        refundId: any;
        paymentId: any;
        amount: any;
        status: string;
    }>;
    getAvailableGateways(req: any): Promise<any>;
    generateGstInvoice(invoiceDto: any, req: any): Promise<{
        invoiceId: any;
        invoiceNumber: any;
        grandTotal: any;
        status: string;
    }>;
    getGstInvoice(invoiceId: string, req: any): Promise<{
        invoiceId: any;
        invoiceNumber: any;
        invoiceDate: any;
        customerName: any;
        customerGstin: any;
        items: any;
        totalAmount: any;
        cgstRate: any;
        cgstAmount: any;
        sgstRate: any;
        sgstAmount: any;
        igstRate: any;
        igstAmount: any;
        grandTotal: any;
        status: any;
    }>;
    generateCreditNote(creditNoteDto: any, req: any): Promise<{
        creditNoteId: any;
        creditNoteNumber: any;
        originalInvoiceId: any;
        totalAmount: any;
        status: string;
    }>;
    getGstReports(query: any, req: any): Promise<{
        summary: {
            totalInvoices: any;
            totalTaxableValue: any;
            totalCgst: any;
            totalSgst: any;
            totalIgst: any;
            totalGrandTotal: any;
        };
        invoices: any;
    }>;
    createJournalEntry(entryDto: any, req: any): Promise<{
        entryId: any;
        entryNumber: any;
        totalDebit: any;
        totalCredit: any;
        status: string;
    }>;
    getAccountLedger(accountCode: string, query: any, req: any): Promise<{
        accountCode: string;
        entries: any;
        openingBalance: number;
        closingBalance: number;
    }>;
    getTrialBalance(query: any, req: any): Promise<{
        asOnDate: any;
        trialBalance: {
            accountCode: string;
            accountName: string;
            debit: any;
            credit: any;
            balance: number;
        }[];
        totalDebit: number;
        totalCredit: number;
    }>;
    getBalanceSheet(query: any, req: any): Promise<{
        asOnDate: any;
        assets: {
            total: number;
            accounts: {
                accountCode: string;
                accountName: string;
                debit: any;
                credit: any;
                balance: number;
            }[];
        };
        liabilities: {
            total: number;
            accounts: {
                accountCode: string;
                accountName: string;
                debit: any;
                credit: any;
                balance: number;
            }[];
        };
        equity: {
            total: number;
            accounts: {
                accountCode: string;
                accountName: string;
                debit: any;
                credit: any;
                balance: number;
            }[];
        };
    }>;
    getProfitLoss(query: any, req: any): Promise<{
        period: {
            fromDate: any;
            toDate: any;
        };
        revenue: {
            total: any;
            accounts: {
                accountCode: any;
                accountName: string;
                amount: any;
            }[];
        };
        expenses: {
            total: any;
            accounts: {
                accountCode: any;
                accountName: string;
                amount: any;
            }[];
        };
        netProfit: number;
    }>;
    handleWebhook(webhookId: string, webhookDto: any): Promise<{
        status: string;
        eventId: any;
    }>;
    createWebhook(webhookDto: any, req: any): Promise<{
        webhookId: any;
        name: any;
        url: any;
        secret: any;
        isActive: any;
    }>;
    getWebhooks(req: any): Promise<any>;
    updateWebhook(webhookId: string, webhookDto: any, req: any): Promise<{
        webhookId: any;
        name: any;
        url: any;
        isActive: any;
    }>;
    deleteWebhook(webhookId: string, req: any): Promise<void>;
    testWebhook(webhookId: string, req: any): Promise<{
        webhookId: string;
        status: string;
        response: {
            status: number;
            message: string;
        };
    }>;
    createApiKey(apiKeyDto: any, req: any): Promise<{
        apiKeyId: any;
        name: any;
        key: any;
        scopes: any;
        expiresAt: any;
        rateLimit: any;
        isActive: any;
    }>;
    getApiKeys(req: any): Promise<any>;
    updateApiKey(apiKeyId: string, apiKeyDto: any, req: any): Promise<{
        apiKeyId: any;
        name: any;
        scopes: any;
        expiresAt: any;
        rateLimit: any;
        isActive: any;
    }>;
    revokeApiKey(apiKeyId: string, req: any): Promise<void>;
    rotateApiKey(apiKeyId: string, req: any): Promise<{
        apiKeyId: any;
        name: any;
        key: string;
        scopes: any;
    }>;
    getIntegrationStatus(req: any): Promise<{
        tenantId: any;
        overall: "UNKNOWN" | "ERROR" | "HEALTHY" | "WARNING";
        integrations: {
            fhir: {
                integrationType: string;
                status: string;
                lastSyncAt: any;
                isActive: any;
            };
            hl7: {
                integrationType: string;
                status: string;
                lastSyncAt: any;
                isActive: any;
            };
            pacs: {
                integrationType: string;
                status: string;
                lastSyncAt: any;
                isActive: any;
            };
            lis: {
                integrationType: string;
                status: string;
                lastSyncAt: any;
                isActive: any;
            };
            payment: {
                integrationType: string;
                status: string;
                lastSyncAt: any;
                isActive: any;
            };
            gst: {
                integrationType: string;
                status: string;
                lastSyncAt: any;
                isActive: any;
            };
            accounting: {
                integrationType: string;
                status: string;
                lastSyncAt: any;
                isActive: any;
            };
            webhooks: {
                integrationType: string;
                status: string;
                lastSyncAt: any;
                isActive: any;
            };
        };
    }>;
    getIntegrationConfigurations(req: any): Promise<any>;
    updateIntegrationConfiguration(configDto: any, req: any): Promise<any>;
    syncFhirData(syncDto: any, req: any): Promise<{
        resourceType: string;
        syncedFrom: Date;
        syncedTo: Date;
        recordsProcessed: number;
        errors: never[];
    }>;
    syncHl7Data(syncDto: any, req: any): Promise<{
        messageType: string;
        syncedFrom: Date;
        syncedTo: Date;
        recordsProcessed: number;
        errors: never[];
    }>;
    getSyncStatus(req: any): Promise<any>;
}
