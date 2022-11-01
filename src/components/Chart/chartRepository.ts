import { Chart } from "@entities/Chart";
import { PrescribedMD } from "@entities/PrescribedMD";
import { CREATED, FORBIDDEN } from "http-status-codes";
import { Service } from "typedi";
import { IChartRepository } from "./interface/IChartRepository";

@Service()
export class ChartRepository implements IChartRepository {
    async save(chart: Chart): Promise<Mutation<Chart | void>> {
        try {
            const result = await Chart.save(chart);

            if (!result) throw Error("새로운 진료 작성에 실패했습니다.");

            return {
                status: CREATED,
                success: true,
                message: "진료 등록 완료",
                result,
            };
        } catch (err: any) {
            return {
                status: FORBIDDEN,
                success: false,
                message: err.message,
                error: err,
            };
        }
    }

    async findall(pid: string): Promise<Chart[]> {
        const result: Chart[] = await Chart.find({
            order: { id: "DESC" },
            where: { id: pid },
            relations: ["visit", "patient", "doctor"],
        });

        return result;
    }

    async findOneByVid(vid: number): Promise<Chart> {
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", vid);
        const result: Chart | undefined = await Chart.findOne({
            where: {
                visit: {
                    id: vid,
                },
            },
        });
        console.log("result@@@@@@@@@@@@@@@@@@@@@@", result);

        if (!result) {
            throw Error("진료가 완료되지 않았습니다.");
        }

        return result;
    }
}

export { Chart, PrescribedMD };
