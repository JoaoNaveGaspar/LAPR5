using System.Threading.Tasks;
using System.Collections.Generic;
using MDWM.Domain.Shared;
using MDWM.Domain.Warehouses;

namespace MDWM.Domain.Deliveries
{
    public class DeliveryService
    {
        private readonly IUnitOfWork _unitOfWork;

        private readonly IDeliveryRepository _repo;

        private readonly IWarehouseRepository _repo_war;

        public DeliveryService(IUnitOfWork unitOfWork, IDeliveryRepository repo, IWarehouseRepository repo_war)
        {
            _unitOfWork = unitOfWork;
            _repo = repo;
            _repo_war = repo_war;
        }

        public async Task<List<DeliveryDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();
            
            List<DeliveryDto> listDto = list.ConvertAll<DeliveryDto>
            (del => new DeliveryDto{
                Id = del.Id.AsString(),
                date = del.date._Date, 
                weight = del.weight._Weight,
                destinationWarehouseId = del.destinationWarehouseId.AsString(),
                loadTime = del.packagingTime._LoadTime, 
                unloadTime = del.packagingTime._UnloadTime});

            return listDto;
        }

        public async Task<DeliveryDto> GetByIdAsync(DeliveryId id)
        {
            var del = await this._repo.GetByIdAsync(id);
            
            if(del == null)
                return null;

            return DeliveryMapper.toDTO(del);
        }

        public async Task<DeliveryDto> AddAsync(DeliveryDto dto)
        {
            await checkWarehouseIdAsync(new WarehouseId(dto.destinationWarehouseId));

            var del = new Delivery(dto.Id, dto.date, dto.weight, dto.destinationWarehouseId, dto.loadTime, dto.unloadTime);

            await this._repo.AddAsync(del);

            await this._unitOfWork.CommitAsync();

            return DeliveryMapper.toDTO(del);
        }

        public async Task<DeliveryDto> UpdateAsync(DeliveryDto dto)
        {
            var del = await this._repo.GetByIdAsync(new DeliveryId(dto.Id)); 

            if (del == null)
                return null;   

            // change all field
            del.ChangeDate(dto.date);
            del.ChangeWeight(dto.weight);
            del.ChangeWarehouseDeliveryId(dto.destinationWarehouseId);
            del.ChangePackagingTime(dto.loadTime,dto.unloadTime);
            
            await this._unitOfWork.CommitAsync();

            return DeliveryMapper.toDTO(del);
        }

        public async Task<DeliveryDto> InactivateAsync(DeliveryId id)
        {
            var del = await this._repo.GetByIdAsync(id); 

            if (del == null)
                return null;   

            // change all fields
            del.MarkAsInative();
            
            await this._unitOfWork.CommitAsync();

            return DeliveryMapper.toDTO(del);
        }

        public async Task<DeliveryDto> DeleteAsync(DeliveryId id)
        {
            var del = await this._repo.GetByIdAsync(id); 

            if (del == null)
                return null;   

            if (del.Active)
                throw new BusinessRuleValidationException("It is not possible to delete an active delivery.");
            
            this._repo.Remove(del);
            await this._unitOfWork.CommitAsync();

            return DeliveryMapper.toDTO(del);
        }    

        private async Task checkWarehouseIdAsync(WarehouseId warehouseId){
            var war = await _repo_war.GetByIdAsync(warehouseId);
            if (war == null)
                throw new BusinessRuleValidationException("Invalid Warehouse Id.");
        }   
    }
}