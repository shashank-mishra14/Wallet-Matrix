# Assets Folder Structure

This folder contains all the static assets used in the Wallet Matrix application.

## Folder Structure

```
public/assets/
├── icons/          # App icons and general icons
│   └── wallet-icon.svg  # Main wallet icon used for favicon and navbar
├── wallets/        # Wallet-specific logos
│   ├── phantom.svg
│   ├── solflare.svg
│   ├── backpack.svg
│   └── ... (add more wallet logos here)
└── README.md       # This file
```

## Adding Wallet Logos

To add a new wallet logo:

1. **File Format**: Preferably SVG format for scalability, but PNG/JPG are also supported
2. **Naming Convention**: Use lowercase wallet name with hyphens for spaces
   - Example: `phantom.svg`, `magic-eden.svg`, `coinbase-wallet.svg`
3. **Size**: For PNG/JPG files, recommended minimum size is 64x64px
4. **Location**: Place files in the `public/assets/wallets/` folder

## Usage in Components

### Importing Wallet Logos

```typescript
// For SVG files
import PhantomLogo from '/assets/wallets/phantom.svg'

// For PNG/JPG files
import BackpackLogo from '/assets/wallets/backpack.png'
```

### Using in JSX

```jsx
<img src={PhantomLogo} alt="Phantom Wallet" className="w-8 h-8" />

// Or with dynamic imports
<img src={`/assets/wallets/${walletName.toLowerCase()}.svg`} alt={`${walletName} Wallet`} />
```

### Fallback for Missing Logos

```jsx
const WalletLogo = ({ walletName, className = "w-8 h-8" }) => {
  const [logoSrc, setLogoSrc] = useState(`/assets/wallets/${walletName.toLowerCase()}.svg`)
  
  const handleError = () => {
    // Fallback to a default wallet icon
    setLogoSrc('/assets/icons/wallet-icon.svg')
  }
  
  return (
    <img 
      src={logoSrc} 
      alt={`${walletName} Wallet`} 
      className={className}
      onError={handleError}
    />
  )
}
```

## Icon Guidelines

- **Consistency**: Try to maintain consistent styling across all wallet logos
- **Accessibility**: Always include meaningful alt text
- **Performance**: Optimize images for web use (compress SVGs, use appropriate PNG/JPG compression)
- **Copyright**: Ensure you have proper permissions to use wallet logos

## Contributing

When adding new wallet logos:
1. Ensure the logo is the official logo of the wallet
2. Optimize the file size
3. Test that it displays correctly across different screen sizes
4. Update the wallet data in `src/data/wallets.json` to reference the new logo 