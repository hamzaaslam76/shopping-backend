# Email Service Setup Guide

This guide explains how to set up and use the email service functionality in the application.

## Features

- **Product Created Email**: Automatically sends email notifications when new products are created
- **Order Confirmation Email**: Sends confirmation emails when orders are placed
- **Welcome Email**: Sends welcome emails to new customers
- **Test Email**: Test email functionality

## Email Templates

The application includes three HTML email templates:

1. **Product Created Email** (`templates/productCreatedEmail.html`)
   - Sent when a new product is created
   - Includes product details, images, and features
   - Professional design with responsive layout

2. **Order Confirmation Email** (`templates/orderConfirmationEmail.html`)
   - Sent when an order is placed
   - Includes order details, items, and shipping information
   - Confirmation and tracking information

3. **Welcome Email** (`templates/welcomeEmail.html`)
   - Sent to new customers
   - Welcome message and feature highlights
   - Call-to-action buttons

## Configuration

### Environment Variables

Add these variables to your `config.env` file:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# Application URLs
BASE_URL=http://localhost:8000
CLIENT_URL=http://localhost:5173

# Notification Emails
PRODUCT_NOTIFICATION_EMAIL=admin@yourstore.com
ADMIN_EMAIL=admin@yourstore.com
```

### Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password in `EMAIL_PASS`

### Alternative Email Providers

#### Mailtrap (Development/Testing)
```env
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your-mailtrap-username
EMAIL_PASS=your-mailtrap-password
```

#### SendGrid
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

#### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

## Usage

### Automatic Email Sending

Emails are automatically sent in these scenarios:

1. **Product Creation**: When a new product is created via the dashboard
2. **Order Placement**: When a customer places an order

### Manual Email Sending

You can also send emails manually using the email API endpoints:

#### Test Email
```bash
POST /api/v1/emails/test
Content-Type: application/json

{
  "email": "test@example.com"
}
```

#### Welcome Email
```bash
POST /api/v1/emails/welcome
Content-Type: application/json

{
  "email": "customer@example.com",
  "name": "John Doe"
}
```

#### Product Notification Email
```bash
POST /api/v1/emails/product-notification
Content-Type: application/json

{
  "email": "customer@example.com",
  "productData": {
    "title": "New Product",
    "price": 99.99,
    "description": "Amazing new product",
    "brand": "Premium Brand",
    "gender": "Unisex",
    "material": "High Quality",
    "style": "Modern",
    "category": { "name": "Shoes" },
    "availableSizes": [38, 40, 42, 44],
    "totalStock": 100,
    "mainImages": [{ "url": "/uploads/products/image.jpg" }],
    "_id": "product-id"
  }
}
```

## Email Service Class

The `EmailService` class (`utils/emailService.js`) provides:

- **Template Loading**: Loads and compiles Handlebars templates
- **Email Sending**: Sends emails using Nodemailer
- **Error Handling**: Graceful error handling without breaking the main flow
- **Configuration**: Uses environment variables for configuration

### Methods

- `sendProductCreatedEmail(productData, recipientEmail)`
- `sendOrderConfirmationEmail(orderData, customerEmail)`
- `sendWelcomeEmail(customerEmail, customerName)`
- `sendTestEmail(recipientEmail)`

## Customization

### Template Customization

1. **Edit HTML Templates**: Modify the templates in the `templates/` directory
2. **Styling**: Update CSS styles within the templates
3. **Content**: Modify text content and structure
4. **Variables**: Use Handlebars syntax `{{variableName}}` for dynamic content

### Email Content Customization

Modify the `templateData` objects in the email service methods to customize:
- Product information
- Order details
- Customer information
- URLs and links
- Branding elements

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Check email credentials
   - Ensure 2FA is enabled for Gmail
   - Verify app password is correct

2. **Connection Timeout**
   - Check EMAIL_HOST and EMAIL_PORT
   - Verify firewall settings
   - Try different email provider

3. **Template Not Found**
   - Ensure template files exist in `templates/` directory
   - Check file permissions
   - Verify template names match method calls

4. **Email Not Sending**
   - Check console logs for error messages
   - Verify recipient email address
   - Test with a simple test email first

### Testing

1. **Test Email Configuration**:
   ```bash
   curl -X POST http://localhost:8000/api/v1/emails/test \
     -H "Content-Type: application/json" \
     -d '{"email": "your-email@example.com"}'
   ```

2. **Check Console Logs**: Look for email service initialization and sending messages

3. **Verify Environment Variables**: Ensure all required variables are set

## Security Considerations

- **Never commit email credentials** to version control
- **Use environment variables** for all sensitive information
- **Implement rate limiting** for email endpoints
- **Validate email addresses** before sending
- **Use HTTPS** in production

## Production Deployment

1. **Use a reliable email service** (SendGrid, Mailgun, AWS SES)
2. **Set up proper DNS records** (SPF, DKIM, DMARC)
3. **Monitor email delivery** and bounce rates
4. **Implement email queuing** for high volume
5. **Set up email analytics** and tracking

## Support

For issues or questions:
1. Check the console logs for error messages
2. Verify email service configuration
3. Test with a simple email first
4. Check email provider documentation
5. Review this guide for common solutions
