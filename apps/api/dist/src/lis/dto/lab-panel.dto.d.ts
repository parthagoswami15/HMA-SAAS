import { TestCategory } from './lab-test.dto';
export declare class CreateLabPanelDto {
    name: string;
    description: string;
    category: TestCategory;
    isActive?: boolean;
}
export declare class UpdateLabPanelDto {
    name?: string;
    description?: string;
    isActive?: boolean;
}
export declare class LabPanelResponseDto {
    id: string;
    name: string;
    description: string;
    category: TestCategory;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    tests: Array<{
        id: string;
        code: string;
        name: string;
        category: TestCategory;
        unit?: string;
        referenceRanges?: any[];
    }>;
}
