# Script PowerShell pour créer l'architecture Lean NestJS e-commerce

# Création du dossier racine
New-Item -ItemType Directory -Force -Name "src"

# Fichiers racine
New-Item -ItemType File -Force -Path "src\app.module.ts"
New-Item -ItemType File -Force -Path "src\main.ts"

# Dossier config
New-Item -ItemType Directory -Force -Path "src\config"
New-Item -ItemType File -Force -Path "src\config\database.config.ts"

# Dossier common
New-Item -ItemType Directory -Force -Path "src\common"
New-Item -ItemType Directory -Force -Path "src\common\guards"
New-Item -ItemType File -Force -Path "src\common\guards\jwt-auth.guard.ts"
New-Item -ItemType Directory -Force -Path "src\common\enums"
New-Item -ItemType File -Force -Path "src\common\enums\role.enum.ts"

# Dossier modules
New-Item -ItemType Directory -Force -Path "src\modules"

# Module Auth
New-Item -ItemType Directory -Force -Path "src\modules\auth"
New-Item -ItemType File -Force -Path "src\modules\auth\auth.module.ts"
New-Item -ItemType File -Force -Path "src\modules\auth\auth.controller.ts"
New-Item -ItemType File -Force -Path "src\modules\auth\auth.service.ts"

# Module Users
New-Item -ItemType Directory -Force -Path "src\modules\users"
New-Item -ItemType File -Force -Path "src\modules\users\users.module.ts"
New-Item -ItemType File -Force -Path "src\modules\users\users.controller.ts"
New-Item -ItemType File -Force -Path "src\modules\users\users.service.ts"

# Module Categories
New-Item -ItemType Directory -Force -Path "src\modules\categories"
New-Item -ItemType File -Force -Path "src\modules\categories\categories.module.ts"
New-Item -ItemType File -Force -Path "src\modules\categories\categories.controller.ts"
New-Item -ItemType File -Force -Path "src\modules\categories\categories.service.ts"

# Module Products
New-Item -ItemType Directory -Force -Path "src\modules\products"
New-Item -ItemType File -Force -Path "src\modules\products\products.module.ts"
New-Item -ItemType File -Force -Path "src\modules\products\products.controller.ts"
New-Item -ItemType File -Force -Path "src\modules\products\products.service.ts"

# Module Orders
New-Item -ItemType Directory -Force -Path "src\modules\orders"
New-Item -ItemType File -Force -Path "src\modules\orders\orders.module.ts"
New-Item -ItemType File -Force -Path "src\modules\orders\orders.controller.ts"
New-Item -ItemType File -Force -Path "src\modules\orders\orders.service.ts"

# Dossier database
New-Item -ItemType Directory -Force -Path "src\database"
New-Item -ItemType File -Force -Path "src\database\typeorm.module.ts"

Write-Host "✅ Architecture Lean NestJS créée avec succès !"
