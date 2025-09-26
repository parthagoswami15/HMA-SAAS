import { VitalsService } from '../services/vitals.service';
import { CreateVitalsDto } from '../dto/vitals/create-vitals.dto';
import { UpdateVitalsDto } from '../dto/vitals/update-vitals.dto';
import { Vitals } from '../entities/vitals.entity';
import { User } from '../../users/entities/user.entity';
export declare class VitalsController {
    private readonly vitalsService;
    constructor(vitalsService: VitalsService);
    create(createVitalsDto: CreateVitalsDto, user: User): Promise<Vitals>;
    findAll(patientId?: string, visitId?: string): Promise<Vitals[]>;
    findOne(id: string): Promise<Vitals>;
    getLastVitals(patientId: string): Promise<Partial<Vitals>>;
    getVitalsTrends(patientId: string, metric: keyof Vitals, days?: number): Promise<{
        date: Date;
        value: any;
    }[]>;
    update(id: string, updateVitalsDto: UpdateVitalsDto): Promise<Vitals>;
    remove(id: string): Promise<void>;
    getVitalsByVisit(visitId: string): Promise<Vitals[]>;
}
