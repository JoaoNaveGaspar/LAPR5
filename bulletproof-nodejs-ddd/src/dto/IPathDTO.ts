export default interface IPathDTO{
    pathid:string;
    warehouseDestination:string;
    warehouseDeparture:string;
    distance: number;//in kms
    travelTime: number;//in minutes
    energyNecessary: number//in kwh
    additionalTime:number;
}