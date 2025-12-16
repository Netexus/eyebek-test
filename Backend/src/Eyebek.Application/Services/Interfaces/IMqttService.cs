namespace Eyebek.Application.Services.Interfaces;

public interface IMqttService
{
    /// <summary>
    /// Publishes an MQTT message to control the servo motor
    /// </summary>
    /// <param name="companyId">Company ID for topic isolation</param>
    /// <param name="action">Action to perform (ABRIR/CERRAR)</param>
    Task PublishServoCommandAsync(string companyId, string action);
}
