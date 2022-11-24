import { Result } from "../../core/logic/Result";
import ITruckDTO from "../../dto/ITruckDTO";

export default interface ITruckService  {
  patchTruck(info: string): Result<ITruckDTO> | PromiseLike<Result<ITruckDTO>>;
  createTruck(truckDTO: ITruckDTO): Promise<Result<ITruckDTO>>;
  updateTruck(truckDTO: ITruckDTO): Promise<Result<ITruckDTO>>;

  getTruck (truckId: string): Promise<Result<ITruckDTO>>;
  getTrucks (): Promise<Result<ITruckDTO[]>>;

  patchTruck (truckInfo: string): Promise<Result<ITruckDTO>>;
}