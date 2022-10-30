import { Patient } from "@entities/Patient";
import { Visit } from "@entities/Visit";
import { BadRequest } from "@errors/errorGenerator";
import { NO_CONTENT, OK } from "http-status-codes";
import { Service } from "typedi";
import { LessThan } from "typeorm";
import { ResponseVisitRecordDto } from "./dtos";
import { ResponseVisitInfoDto } from "./dtos/response/ResponseVisitInfoDto";
import { IVisitRepository } from "./interface/IVisitRepository";

@Service()
export class VisitRepository implements IVisitRepository {
    async findall(): Promise<Visit[]> {
        const result: Visit[] = await Visit.find({
            where: {
                status: LessThan(4),
            },
            relations: ["patient"],
        });

        return result;
    }

    async findBypid(pid: string): Promise<Mutation<ResponseVisitInfoDto>> {
        const result = await Visit.findOne({
            where: { patient: { id: pid } },
            relations: ["patient"],
        });

        if (result) {
            const response: ResponseVisitInfoDto = new ResponseVisitInfoDto(result);

            return {
                status: OK,
                success: true,
                message: "환자 정보 반환 성공",
                result: response,
            };
        } else {
            return {
                status: NO_CONTENT,
                success: false,
                message: "환자 정보 없음",
            };
        }
    }

    async findallBypid(pid: string): Promise<Visit[]> {
        return await Visit.find({
            where: {
                patient: {
                    id: pid,
                },
            },
            relations: ["doctor"],
        });
    }
}

export { Visit };