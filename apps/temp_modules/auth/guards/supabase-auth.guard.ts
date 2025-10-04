import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// import { GqlExecutionContext } from '@nestjs/graphql'; // TODO: Install GraphQL package if needed
import { Observable } from 'rxjs';

@Injectable()
export class SupabaseAuthGuard extends AuthGuard('supabase-jwt') {
  getRequest(context: ExecutionContext) {
    // TODO: Implement GraphQL support when GraphQL package is installed
    /*
    const ctx = GqlExecutionContext.create(context);
    if (ctx) {
      // For GraphQL requests
      return ctx.getContext().req;
    }
    */
    // For REST requests
    return context.switchToHttp().getRequest();
  }
}
