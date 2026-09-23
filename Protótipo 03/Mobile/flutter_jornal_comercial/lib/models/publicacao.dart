class Publicacao {
  final int id;
  final String? texto;
  final DateTime dataPublicacao;
  final Map<String, dynamic>? autor;
  final Map<String, dynamic>? empresa;
  final List<dynamic> hashtags;
  final List<dynamic> curtidas;
  final List<dynamic> comentarios;
  final List<dynamic> midias;

  Publicacao({
    required this.id,
    this.texto,
    required this.dataPublicacao,
    this.autor,
    this.empresa,
    required this.hashtags,
    required this.curtidas,
    required this.comentarios,
    required this.midias,
  });

  factory Publicacao.fromJson(Map<String, dynamic> json) {
    return Publicacao(
      id: json['id'],
      texto: json['texto'],
      dataPublicacao: DateTime.parse(
        json['dataPublicacao'],
      ),
      autor: json['autor'],
      empresa: json['empresa'],
      hashtags: json['hashtags'] ?? [],
      curtidas: json['curtidas'] ?? [],
      comentarios: json['comentarios'] ?? [],
      midias: json['midias'] ?? [],
    );
  }

  int get quantidadeCurtidas => curtidas.length;

  int get quantidadeComentarios => comentarios.length;
}