"""0001_initial_schema

Revision ID: 0001_initial_schema
Revises: 
Create Date: 2026-11-04 23:20:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '0001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. products
    op.create_table(
        'products',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('slug', sa.String(length=120), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=False, server_default=''),
        sa.Column('category', sa.String(length=60), nullable=False),
        sa.Column('base_price', sa.Integer(), nullable=False, comment='Base price in integer Paise (INR)'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column('is_demo', sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('slug')
    )
    op.create_index('ix_products_category', 'products', ['category'], unique=False)
    op.create_index('ix_products_slug', 'products', ['slug'], unique=True)

    # 2. product_variants
    op.create_table(
        'product_variants',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('product_id', sa.Integer(), nullable=False),
        sa.Column('size', sa.String(length=20), nullable=False),
        sa.Column('color', sa.String(length=50), nullable=False),
        sa.Column('price', sa.Integer(), nullable=False, comment='Variant price in integer Paise (INR)'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('product_id', 'size', 'color', name='uq_variant_product_size_color')
    )
    op.create_index('ix_variant_product_active', 'product_variants', ['product_id', 'is_active'], unique=False)

    # 3. variant_qikink_skus
    op.create_table(
        'variant_qikink_skus',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('variant_id', sa.Integer(), nullable=False),
        sa.Column('environment', sa.Enum('sandbox', 'live', name='qikink_env_enum'), nullable=False),
        sa.Column('qikink_sku', sa.String(length=80), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['variant_id'], ['product_variants.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('variant_id', 'environment', name='uq_variant_qikink_env')
    )
    op.create_index('ix_variant_env_sku', 'variant_qikink_skus', ['variant_id', 'environment'], unique=False)

    # 4. product_images
    op.create_table(
        'product_images',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('product_id', sa.Integer(), nullable=False),
        sa.Column('color', sa.String(length=50), nullable=True),
        sa.Column('url', sa.Text(), nullable=False),
        sa.Column('sort_order', sa.Integer(), nullable=False, server_default='0'),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # 5. customers
    op.create_table(
        'customers',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('phone', sa.String(length=20), nullable=True),
        sa.Column('name', sa.String(length=120), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    op.create_index('ix_customers_email', 'customers', ['email'], unique=True)
    op.create_index('ix_customers_phone', 'customers', ['phone'], unique=False)

    # 6. addresses
    op.create_table(
        'addresses',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('customer_id', sa.Integer(), nullable=False),
        sa.Column('full_name', sa.String(length=120), nullable=False),
        sa.Column('address_line1', sa.String(length=255), nullable=False),
        sa.Column('address_line2', sa.String(length=255), nullable=True),
        sa.Column('city', sa.String(length=100), nullable=False),
        sa.Column('state', sa.String(length=100), nullable=False),
        sa.Column('postal_code', sa.String(length=20), nullable=False),
        sa.Column('phone', sa.String(length=20), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['customer_id'], ['customers.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_addresses_postal_code', 'addresses', ['postal_code'], unique=False)

    # 7. orders
    op.create_table(
        'orders',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('public_order_number', sa.String(length=15), nullable=False),
        sa.Column('customer_id', sa.Integer(), nullable=False),
        sa.Column('address_snapshot', sa.JSON(), nullable=False),
        sa.Column('subtotal', sa.Integer(), nullable=False, comment='Cart subtotal in Paise'),
        sa.Column('shipping_fee', sa.Integer(), nullable=False, server_default='0', comment='Shipping fee in Paise'),
        sa.Column('cod_fee', sa.Integer(), nullable=False, server_default='0', comment='COD fee in Paise'),
        sa.Column('total', sa.Integer(), nullable=False, comment='Grand total in Paise'),
        sa.Column('payment_method', sa.Enum('prepaid', 'cod', name='payment_method_enum'), nullable=False),
        sa.Column('payment_status', sa.Enum('pending', 'captured', 'failed', 'refunded', name='payment_status_enum'), nullable=False, server_default='pending'),
        sa.Column('order_status', sa.Enum('pending', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled', name='order_status_enum'), nullable=False, server_default='pending'),
        sa.Column('qikink_order_id', sa.String(length=60), nullable=True),
        sa.Column('qikink_status', sa.String(length=60), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.CheckConstraint('length(public_order_number) <= 15', name='ck_public_order_number_length'),
        sa.ForeignKeyConstraint(['customer_id'], ['customers.id']),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('public_order_number')
    )
    op.create_index('ix_orders_customer_id', 'orders', ['customer_id'], unique=False)
    op.create_index('ix_orders_public_order_num', 'orders', ['public_order_number'], unique=True)
    op.create_index('ix_orders_status', 'orders', ['order_status'], unique=False)
    op.create_index('ix_orders_qikink_order_id', 'orders', ['qikink_order_id'], unique=False)

    # 8. order_items
    op.create_table(
        'order_items',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('order_id', sa.Integer(), nullable=False),
        sa.Column('variant_id', sa.Integer(), nullable=False),
        sa.Column('qty', sa.Integer(), nullable=False),
        sa.Column('unit_price', sa.Integer(), nullable=False, comment='Unit price at checkout in Paise'),
        sa.Column('sku_snapshot', sa.String(length=80), nullable=False),
        sa.ForeignKeyConstraint(['order_id'], ['orders.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['variant_id'], ['product_variants.id']),
        sa.PrimaryKeyConstraint('id')
    )

    # 9. payments
    op.create_table(
        'payments',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('order_id', sa.Integer(), nullable=False),
        sa.Column('provider', sa.String(length=50), nullable=False),
        sa.Column('provider_payment_id', sa.String(length=100), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=False),
        sa.Column('raw_payload', sa.JSON(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['order_id'], ['orders.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_payments_order_id', 'payments', ['order_id'], unique=False)
    op.create_index('ix_payments_provider_id', 'payments', ['provider', 'provider_payment_id'], unique=False)

    # 10. returns
    op.create_table(
        'returns',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('order_id', sa.Integer(), nullable=False),
        sa.Column('reason', sa.Text(), nullable=False),
        sa.Column('status', sa.Enum('requested', 'pickup_scheduled', 'received_in_warehouse', 'restocked', 'refunded', 'rejected', name='return_status_enum'), nullable=False, server_default='requested'),
        sa.Column('qikink_reverse_ref', sa.String(length=80), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['order_id'], ['orders.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # 11. waitlist_signups
    op.create_table(
        'waitlist_signups',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('source', sa.String(length=60), nullable=False, server_default='hero_cta'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    op.create_index('ix_waitlist_signups_email', 'waitlist_signups', ['email'], unique=True)

    # 12. webhook_events
    op.create_table(
        'webhook_events',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('source', sa.String(length=50), nullable=False),
        sa.Column('event_id', sa.String(length=120), nullable=False),
        sa.Column('payload', sa.JSON(), nullable=False),
        sa.Column('processed_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('event_id')
    )
    op.create_index('ix_webhook_source_event', 'webhook_events', ['source', 'event_id'], unique=False)


def downgrade() -> None:
    op.drop_table('webhook_events')
    op.drop_table('waitlist_signups')
    op.drop_table('returns')
    op.drop_table('payments')
    op.drop_table('order_items')
    op.drop_table('orders')
    op.drop_table('addresses')
    op.drop_table('customers')
    op.drop_table('product_images')
    op.drop_table('variant_qikink_skus')
    op.drop_table('product_variants')
    op.drop_table('products')
    
    # Drop Enums
    sa.Enum(name='return_status_enum').drop(op.get_bind(), checkfirst=True)
    sa.Enum(name='order_status_enum').drop(op.get_bind(), checkfirst=True)
    sa.Enum(name='payment_status_enum').drop(op.get_bind(), checkfirst=True)
    sa.Enum(name='payment_method_enum').drop(op.get_bind(), checkfirst=True)
    sa.Enum(name='qikink_env_enum').drop(op.get_bind(), checkfirst=True)

