using Eyebek.Application.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MQTTnet;
using MQTTnet.Client;
using System.Text;
using System.Text.Json;

namespace Eyebek.Infrastructure.Services;

public class MqttService : IMqttService, IAsyncDisposable
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<MqttService> _logger;
    private IMqttClient? _mqttClient;
    private readonly SemaphoreSlim _clientLock = new(1, 1);

    public MqttService(IConfiguration configuration, ILogger<MqttService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task PublishServoCommandAsync(string companyId, string action)
    {
        if (string.IsNullOrEmpty(action) || (action != "ABRIR" && action != "CERRAR"))
        {
            throw new ArgumentException("Acción inválida. Use ABRIR o CERRAR", nameof(action));
        }

        await EnsureConnectedAsync();

        // Build topic with company isolation
        var topicPrefix = _configuration["Mqtt:TopicPrefix"] ?? "empresa";
        var topic = $"{topicPrefix}/acceso";

        // If multi-tenant isolation is needed, uncomment:
        // var topic = $"{companyId}/acceso";

        var message = new { accion = action };
        var payload = JsonSerializer.Serialize(message);

        var mqttMessage = new MqttApplicationMessageBuilder()
            .WithTopic(topic)
            .WithPayload(Encoding.UTF8.GetBytes(payload))
            .WithQualityOfServiceLevel(MQTTnet.Protocol.MqttQualityOfServiceLevel.AtLeastOnce)
            .Build();

        try
        {
            var result = await _mqttClient!.PublishAsync(mqttMessage);
            
            if (result.ReasonCode == MQTTnet.Client.MqttClientPublishReasonCode.Success)
            {
                _logger.LogInformation("MQTT message published to topic {Topic}: {Action}", topic, action);
            }
            else
            {
                _logger.LogWarning("MQTT publish returned code {ReasonCode} for topic {Topic}", 
                    result.ReasonCode, topic);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error publishing MQTT message to topic {Topic}", topic);
            throw;
        }
    }

    private async Task EnsureConnectedAsync()
    {
        await _clientLock.WaitAsync();
        try
        {
            if (_mqttClient != null && _mqttClient.IsConnected)
                return;

            var brokerUrl = _configuration["Mqtt:BrokerUrl"];
            if (string.IsNullOrEmpty(brokerUrl))
            {
                throw new InvalidOperationException("Mqtt:BrokerUrl not configured in appsettings.json");
            }

            // Parse broker URL (e.g., mqtt://192.168.1.19 or mqtt://mqtt-broker:1883)
            var uri = new Uri(brokerUrl);
            var host = uri.Host;
            var port = uri.Port > 0 ? uri.Port : 1883;

            var factory = new MqttFactory();
            _mqttClient = factory.CreateMqttClient();

            var options = new MqttClientOptionsBuilder()
                .WithTcpServer(host, port)
                .WithClientId($"eyebek-backend-{Guid.NewGuid()}")
                .WithCleanSession()
                .Build();

            _logger.LogInformation("Connecting to MQTT broker at {Host}:{Port}", host, port);

            var result = await _mqttClient.ConnectAsync(options, CancellationToken.None);

            if (result.ResultCode == MqttClientConnectResultCode.Success)
            {
                _logger.LogInformation("Successfully connected to MQTT broker");
            }
            else
            {
                _logger.LogError("Failed to connect to MQTT broker: {ResultCode}", result.ResultCode);
                throw new Exception($"Failed to connect to MQTT broker: {result.ResultCode}");
            }

            // Handle disconnection events
            _mqttClient.DisconnectedAsync += async e =>
            {
                _logger.LogWarning("Disconnected from MQTT broker: {Reason}", e.Reason);
                
                if (e.ClientWasConnected)
                {
                    _logger.LogInformation("Attempting to reconnect to MQTT broker...");
                    await Task.Delay(TimeSpan.FromSeconds(5));
                    
                    try
                    {
                        await _mqttClient.ConnectAsync(options, CancellationToken.None);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error reconnecting to MQTT broker");
                    }
                }
            };
        }
        finally
        {
            _clientLock.Release();
        }
    }

    public async ValueTask DisposeAsync()
    {
        if (_mqttClient != null)
        {
            await _mqttClient.DisconnectAsync();
            _mqttClient.Dispose();
        }
        _clientLock.Dispose();
    }
}
