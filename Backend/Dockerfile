# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files to restore dependencies
COPY ./Eyebek.sln ./
COPY ./src/Eyebek.Domain/Eyebek.Domain.csproj ./src/Eyebek.Domain/
COPY ./src/Eyebek.Application/Eyebek.Application.csproj ./src/Eyebek.Application/
COPY ./src/Eyebek.Infrastructure/Eyebek.Infrastructure.csproj ./src/Eyebek.Infrastructure/
COPY ./src/Eyebek.Api/Eyebek.Api.csproj ./src/Eyebek.Api/

# Restore packages
RUN dotnet restore ./src/Eyebek.Api/Eyebek.Api.csproj

# Copy all code
COPY . .

# Publish in Release mode
RUN dotnet publish ./src/Eyebek.Api/Eyebek.Api.csproj -c Release -o /app/publish

# Runtime stage (lighter image)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copy published files from build stage
COPY --from=build /app/publish .

# Configure port (default 5000, can be overridden)
ENV ASPNETCORE_URLS=http://0.0.0.0:5000
EXPOSE 5000

ENTRYPOINT ["dotnet", "Eyebek.Api.dll"]
