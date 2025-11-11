#!/bin/bash

echo "🎨 Installing Shadcn UI Components..."

# Core Components (ยกเว้น toast สำหรับตอนนี้)
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add select
npx shadcn@latest add switch
npx shadcn@latest add dialog
npx shadcn@latest add card
npx shadcn@latest add table
npx shadcn@latest add badge
npx shadcn@latest add calendar
npx shadcn@latest add form
npx shadcn@latest add textarea

echo "✅ Shadcn components installation completed!"
echo ""
echo "📝 Next steps:"
echo "1. Copy all the component files to your project"
echo "2. Set up your .env.local file"
echo "3. Run 'npm run dev' to start the development server"