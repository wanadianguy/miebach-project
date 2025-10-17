import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, ParseUUIDPipe } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { ApiOperation } from '@nestjs/swagger';

//@UseGuards(AuthenticationGuard, RolesGuard)
@Controller('invoices')
export class InvoiceController {
    constructor(private readonly invoicesService: InvoiceService) {}

    //@Roles(Role.MANAGER)
    @Post()
    @ApiOperation({ summary: 'Create an invoice' })
    create(@Body() createInvoiceDto: CreateInvoiceDto) {
        return this.invoicesService.create(createInvoiceDto);
    }

    //@Roles(Role.MANAGER)
    @Get()
    @ApiOperation({ summary: 'Get all invoices' })
    findAll() {
        return this.invoicesService.findAll();
    }

    //@Roles(Role.MANAGER)
    @Get(':id')
    @ApiOperation({ summary: 'Get an invoice by id' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.invoicesService.findOne(id);
    }

    //@Roles(Role.MANAGER)
    @Get('project/:projectId')
    @ApiOperation({ summary: 'Get invoices by project id' })
    findByProject(@Param('projectId', ParseUUIDPipe) projectId: string) {
        return this.invoicesService.findByProject(projectId);
    }

    //@Roles(Role.MANAGER)
    @Patch(':id')
    @ApiOperation({ summary: 'Update an invoice' })
    update(@Param('id', ParseUUIDPipe) id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
        return this.invoicesService.update(id, updateInvoiceDto);
    }

    //@Roles(Role.MANAGER)
    @Delete(':id')
    @ApiOperation({ summary: 'Delete an invoice' })
    @HttpCode(204)
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.invoicesService.remove(id);
    }
}
