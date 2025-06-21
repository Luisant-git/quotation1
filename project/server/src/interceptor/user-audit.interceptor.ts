import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserAuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(UserAuditInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    this.logger.debug(`Processing request to: ${request.path}`);
    this.logger.debug(`User: ${JSON.stringify(user)}`);

    if (user) {
      // Always set concernId if available
      if (user.concernId) {
        request.body.concernId = user.concernId;
      }

      // Handle audit fields using adminId instead of sub
      if (user.adminId) {
        const userId = user.adminId; // Using adminId instead of sub
        const now = new Date();

        switch (request.method) {
          case 'POST':
            request.body.createdBy = userId;

            break;

          case 'PUT':
          case 'PATCH':
            request.body.updatedBy = userId;
            // request.body.ModifiedDate = now;

            if (request.body.Delete_Flg === 1) {
              request.body.deletedBy = userId;
              request.body.DeletedDate = now;
              this.logger.debug(`Set deletedBy (soft delete): ${userId}`);
            }
            break;

          case 'DELETE':
            request.body.Delete_Flg = 1;
            request.body.deletedBy = userId;
            request.body.DeletedDate = now;

            break;
        }
      } else {
        this.logger.warn('User.adminId not available in JWT payload');
      }

      const isPurchaseSale =
        request.path.includes('purchase-entry') ||
        request.path.includes('sale-entries');

      if (isPurchaseSale && user.financialId) {
        request.body.FinancialYearId = user.financialId;
      }
    } else {
      this.logger.warn('No user found in request');
    }

    return next.handle();
  }
}
