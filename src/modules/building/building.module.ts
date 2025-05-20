import { Module } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { drizzleProvider } from 'src/providers/drizzle.provider';
import { AuthModule } from '../auth/auth.module';
import { HistoryModule } from '../history/history.module';
import { BuildingService } from './building.service';

@Module({
  imports: [AuthModule, HistoryModule],
  providers: [BuildingService, drizzleProvider, AuthGuard, RolesGuard],
  exports: [BuildingService],
})
export class BuildingModule {}
