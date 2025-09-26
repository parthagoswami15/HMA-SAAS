import { TestDataService } from './test-data.service';
export declare class TestDataController {
    private testDataService;
    constructor(testDataService: TestDataService);
    createTestData(user: any): Promise<{
        message: string;
        patients: number;
    }>;
    clearTestData(user: any): Promise<{
        message: string;
    }>;
}
